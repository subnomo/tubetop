import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ipcRenderer } from 'electron';
import * as Slider from 'rc-slider/lib/Slider';
import * as ytdl from 'ytdl-core';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPrevious from 'material-ui-icons/SkipPrevious';
import SkipNext from 'material-ui-icons/SkipNext';
import VolumeMute from 'material-ui-icons/VolumeMute';
import VolumeDown from 'material-ui-icons/VolumeDown';
import VolumeUp from 'material-ui-icons/VolumeUp';
import RepeatIcon from 'material-ui-icons/Repeat';
import RepeatOne from 'material-ui-icons/RepeatOne';
import Shuffle from 'material-ui-icons/Shuffle';
import DeleteSweep from 'material-ui-icons/DeleteSweep';

import { SongData } from 'components/Song';
import { parseTime } from 'components/Song/util';
import { AppAction, playSong, clearSongs, editSongs, stopSong } from 'containers/App/actions';
import { selectSongs } from 'containers/App/selectors';
import { Order } from './util';
import {
  PlayerContainer,
  VolumeContainer,
  TimerContainer,
  Controls,
  ExtraControls,
  PlayButton,
  PlayIcon,
  PauseIcon,
  sliderStyle,
  ActiveIcon,
} from './styles';

interface IProps extends React.Props<Player> {
  dispatch: (action: AppAction) => void;
  songs: SongData[];
}

export const enum Repeat {
  None,
  All,
  One,
}

interface IState {
  current: number;
  currentKey: string;
  progress: number;
  time: number;
  volume: number;
  savedVolume: number;
  playing: boolean;
  paused: boolean;
  repeat: Repeat;
  shuffle: boolean;
  order: Order;
}

export class Player extends React.PureComponent<IProps, IState> {
  public audio: HTMLAudioElement;

  constructor(props: IProps) {
    super(props);

    this.state = {
      current: 0,
      currentKey: '',
      progress: 0,
      time: 0,
      volume: 50,
      savedVolume: 50,
      playing: false,
      paused: false,
      repeat: Repeat.None,
      shuffle: false,
      order: new Order(),
    };

    // Media keys
    ipcRenderer.on('play-pause', this.toggle);
    ipcRenderer.on('stop', this.stop);
    ipcRenderer.on('next-track', this.skipNext);
    ipcRenderer.on('previous-track', this.skipPrevious);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { songs } = this.props;
    const { currentKey, order } = this.state;

    // Check if the current song is playing
    let currentPlaying = false;

    for (let i = 0; i < songs.length; i++) {
      if (songs[i].key === currentKey) {
        currentPlaying = songs[i].playing;
        break;
      }
    }

    // Check if the current song is playing in nextProps
    let nextPlaying = false;
    let current = this.state.current;

    for (let i = 0; i < nextProps.songs.length; i++) {
      if (nextProps.songs[i].key === currentKey) {
        nextPlaying = nextProps.songs[i].playing;
        current = i;
        break;
      }
    }

    // If the song has changed, reset state and play the new song
    if (!currentPlaying || !nextPlaying) {
      let newSong = false;

      for (let i = 0; i < nextProps.songs.length; i++) {
        if (nextProps.songs[i].playing) {
          this.audio.pause();

          this.setState({
            current: i,
            currentKey: nextProps.songs[i].key,
            progress: 0,
            time: 0,
            playing: false,
            paused: false,
          }, () => { this.play(nextProps); });

          newSong = true;
          break;
        }
      }

      // If stopped, reset state
      if (!newSong) {
        this.reset();
      }
    }

    // Make sure index is up to date
    else {
      this.setState({
        current,
      });
    }

    let newOrder = new Order(order);

    // Remove deleted songs from order
    for (let i = 0; i < songs.length; i++) {
      let songExists = false;

      for (let j = 0; j < nextProps.songs.length; j++) {
        if (songs[i].key === nextProps.songs[j].key) {
          songExists = true;
          break;
        }
      }

      if (!songExists) newOrder.remove(i);
    }

    // Add new songs to order
    for (let i = 0; i < nextProps.songs.length; i++) {
      let newSong = true;

      for (let j = 0; j < songs.length; j++) {
        if (nextProps.songs[i].key === songs[j].key) {
          newSong = false;
          break;
        }
      }

      if (newSong) newOrder.add(i);
    }

    if (!order.equals(newOrder)) {
      this.setState({
        order: newOrder,
      });
    }
  }

  play = (props: IProps = this.props) => {
    const { dispatch, songs } = props;
    const { playing, paused, current } = this.state;

    // If there's nothing to play, return
    if (songs.length === 0) return;

    // If the song is not scheduled for playing, dispatch playSong
    if (!songs[current].playing) return dispatch(playSong(current));

    // If not playing, fetch song and play
    if (!playing) {
      // Find the currently playing song
      let current = 0;
      let currentKey = '';

      for (let i = 0; i < songs.length; i++) {
        if (songs[i].playing) {
          current = i;
          currentKey = songs[i].key;

          break;
        }
      }

      this.setState({
        current,
        currentKey,
      });

      document.title = `${songs[current].title} - tubetop`;

      // Get song info
      ytdl.getInfo(songs[current].id, (err: any, info: any) => {
        if (err) return console.error(err);

        // Get audio only formats
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        let hqIndex = 0;
        let maxBitrate = 0;

        // Get best possible quality
        audioFormats.forEach((format: any, i: number) => {
          if (format.audioBitrate > maxBitrate) {
            hqIndex = i;
            maxBitrate = format.audioBitrate;
          }
        });

        // Play the song
        this.audio.src = audioFormats[hqIndex].url;
        this.audio.play();

        this.setState({
          playing: true,
        });
      });
    } else if (paused) {
      // If currently paused, resume
      this.audio.play();

      this.setState({
        paused: false,
      });
    }
  }

  playButton = () => {
    this.play();
  }

  pause = () => {
    const { playing, paused } = this.state;

    // Can't pause if we're not playing
    if (playing && !paused) {
      this.audio.pause();

      this.setState({
        paused: true,
      });
    }
  }

  toggle = () => {
    if (this.state.playing && !this.state.paused) {
      this.pause();
    } else {
      this.play();
    }
  }

  reset = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    document.title = 'tubetop';

    this.setState({
      current: 0,
      progress: 0,
      time: 0,
      playing: false,
      paused: false,
    });
  }

  stop = () => {
    this.props.dispatch(stopSong(this.state.current));
  }

  skipPrevious = () => {
    const { current, order } = this.state;

    // Find previous item in order
    let newIndex = 0;

    for (let i = 0; i < order.length; i++) {
      if (order.get(i) === current) {
        newIndex = i - 1;
        break;
      }
    }

    if (newIndex >= 0) {
      this.audio.pause();
      this.props.dispatch(playSong(order.get(newIndex)));

      return true;
    }

    return false;
  }

  skipNext = () => {
    const { current, order } = this.state;

    // Find next item in order
    let newIndex = 0;

    for (let i = 0; i < order.length; i++) {
      if (order.get(i) === current) {
        newIndex = i + 1;
        break;
      }
    }

    if (newIndex < this.props.songs.length) {
      this.audio.pause();
      this.props.dispatch(playSong(order.get(newIndex)));

      return true;
    }

    return false;
  }

  toggleRepeat = () => {
    const { repeat } = this.state;

    if (repeat === Repeat.One) {
      this.setState({
        repeat: Repeat.None,
      });
    } else {
      this.setState({
        repeat: repeat + 1,
      });
    }
  }

  toggleShuffle = () => {
    const { current, order, shuffle, playing } = this.state;

    let newOrder = new Order(order);

    if (shuffle) {
      newOrder.sort();
    } else if (!playing) {
      // Hasn't started playing, do full shuffle
      newOrder.shuffle();
      this.setState({ current: newOrder.get(0) });
    } else {
      // Has started playing, shuffle with current as first
      newOrder.shuffle(current);
    }

    this.setState({
      shuffle: !shuffle,
      order: newOrder,
    });
  }

  clearQueue = () => {
    this.props.dispatch(clearSongs());
  }

  seek = (pos: number) => {
    const { songs } = this.props;
    const { current } = this.state;

    this.audio.currentTime = (pos / 100) * songs[current].duration;

    this.setState({
      progress: pos,
    });
  }

  handleTimeUpdate = () => {
    const { songs } = this.props;
    const { current, time } = this.state;

    if (this.audio.paused) return;

    const progress = (this.audio.currentTime / songs[current].duration) * 100;
    const roundedTime = Math.round(this.audio.currentTime);

    this.setState({
      progress,
      time: roundedTime,
    });
  }

  handleSongEnded = () => {
    const { repeat, order } = this.state;

    if (repeat === Repeat.One) {
      this.seek(0);
      this.audio.play();
      return;
    }

    const skipped = this.skipNext();

    if (!skipped && repeat === Repeat.All) {
      this.props.dispatch(playSong(order.get(0)));
    } else if (!skipped) {
      this.stop();
    }
  }

  handleChangeVolume = (vol: number) => {
    this.audio.volume = vol / 100;

    this.setState({
      volume: vol,
    });
  }

  handleVolumeClick = () => {
    const { volume, savedVolume } = this.state;

    if (volume !== 0) {
      this.audio.volume = 0;

      this.setState({
        volume: 0,
        savedVolume: volume,
      });
    } else {
      this.audio.volume = savedVolume / 100;

      this.setState({
        volume: savedVolume,
      });
    }
  }

  render() {
    const { songs } = this.props;
    const {
      playing,
      paused,
      progress,
      current,
      volume,
      repeat,
      shuffle,
    } = this.state;

    let duration = 0;

    if (songs[current]) {
      duration = songs[current].duration;
    }

    let volumeIcon: JSX.Element;

    if (volume === 0) {
      volumeIcon = <VolumeMute />;
    } else if (volume < 50) {
      volumeIcon = <VolumeDown />;
    } else {
      volumeIcon = <VolumeUp />;
    }

    let repeatIcon: JSX.Element;

    if (repeat === Repeat.None) {
      repeatIcon = <RepeatIcon />;
    } else if (repeat === Repeat.All) {
      repeatIcon = (
        <ActiveIcon>
          <RepeatIcon />
        </ActiveIcon>
      );
    } else {
      repeatIcon = (
        <ActiveIcon>
          <RepeatOne />
        </ActiveIcon>
      );
    }

    return (
      <PlayerContainer>
        <audio
          ref={(audio) => { this.audio = audio; }}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleSongEnded}
        />

        {/* Seek bar */}
        <Slider
          value={this.state.progress}
          onChange={this.seek}
          trackStyle={sliderStyle as any}
          railStyle={{ ...sliderStyle as any, backgroundColor: '' }}
          handleStyle={sliderStyle as any}
        />

        {/* Time / Duration */}
        <TimerContainer>
          <Typography type="subheading" align="center" color="secondary">
            {`${parseTime(this.state.time)} / ${parseTime(duration)}`}
          </Typography>
        </TimerContainer>

        {/* Player controls */}
        <Controls>
          <IconButton aria-label="Repeat" onClick={this.toggleRepeat}>
            {repeatIcon}
          </IconButton>

          <IconButton aria-label="Previous" onClick={this.skipPrevious}>
            <SkipPrevious />
          </IconButton>

          <PlayButton
            color="primary"
            aria-label={playing && !paused ? "Pause" : "Play"}
            onClick={playing && !paused ? this.pause : this.playButton}
          >
            {playing && !paused ? <PauseIcon /> : <PlayIcon />}
          </PlayButton>

          <IconButton aria-label="Next" onClick={this.skipNext}>
            <SkipNext />
          </IconButton>

          <IconButton aria-label="Shuffle" onClick={this.toggleShuffle}>
            {shuffle ? (
              <ActiveIcon>
                <Shuffle />
              </ActiveIcon>
            ) : <Shuffle />}
          </IconButton>

          {/* TODO: make this a dropdown with a "more vert" icon */}
          {/* and don't offset middle controls */}
          <ExtraControls>
            <IconButton aria-label="Clear Queue" onClick={this.clearQueue}>
              <DeleteSweep />
            </IconButton>
          </ExtraControls>
        </Controls>

        {/* Volume control */}
        <VolumeContainer>
          <IconButton aria-label="Mute" onClick={this.handleVolumeClick}>
            {volumeIcon}
          </IconButton>

          <Slider
            value={volume}
            onChange={this.handleChangeVolume}
            trackStyle={sliderStyle as any}
            railStyle={{ ...sliderStyle as any, backgroundColor: '' }}
            handleStyle={sliderStyle as any}
          />
        </VolumeContainer>
      </PlayerContainer>
    );
  }
}

export function mapStateToProps(state: any) {
  const songs: List<SongData> = selectSongs(state);

  return {
    songs: songs.toJS(),
  };
}

export default connect(mapStateToProps)(Player as any);

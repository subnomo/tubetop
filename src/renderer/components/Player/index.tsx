import * as React from 'react';
import { connect } from 'react-redux';
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

import { primary } from '../../colors';
import { SongData } from '../Song';
import { parseTime } from '../Song/util';
import { AppAction, playSong } from '../../containers/App/actions';
import {
  PlayerContainer,
  VolumeContainer,
  TimerContainer,
  Controls,
  PlayButton,
  PlayIcon,
  PauseIcon,
  sliderStyle,
} from './styles';

interface IProps extends React.Props<Player> {
  dispatch: (action: AppAction) => void;
  songs: SongData[];
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
}

class Player extends React.PureComponent<IProps, IState> {
  private audio: HTMLAudioElement;

  constructor() {
    super();

    this.state = {
      current: 0,
      currentKey: '',
      progress: 0,
      time: 0,
      volume: 50,
      savedVolume: 50,
      playing: false,
      paused: false,
    };

    ipcRenderer.on('play-pause', () => {
      if (this.state.playing && !this.state.paused) {
        this.pause();
      } else {
        this.play();
      }
    });

    ipcRenderer.on('stop', this.stop);
    ipcRenderer.on('next-track', this.skipNext);
    ipcRenderer.on('previous-track', this.skipPrevious);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { songs } = this.props;
    const { currentKey } = this.state;

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

    // If a new song is playing, find and play it
    if (!currentPlaying) {
      for (let i = 0; i < nextProps.songs.length; i++) {
        if (nextProps.songs[i].playing) {
          this.audio.pause();

          this.setState({
            current: i,
            currentKey: nextProps.songs[i].key,
          }, () => { this.play(nextProps); });

          break;
        }
      }
    }

    // Else if the song has changed, reset state and play the new song
    else if (!nextPlaying) {
      let newSong = false;

      for (let i = 0; i < nextProps.songs.length; i++) {
        if (i === current) continue;

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

      // If no new song has been played, just stop the current song
      if (!newSong) {
        this.stop();
      }
    }

    // Else, make sure index is up to date
    else {
      this.setState({
        current,
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

      const song = songs[current];

      // Get song info
      ytdl.getInfo(song.id, (err, info) => {
        if (err) return console.error(err);

        // Get audio only formats
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        let hqIndex = 0;
        let maxBitrate = 0;

        // Get best possible quality
        audioFormats.forEach((format, i) => {
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

  stop = () => {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.setState({
      current: 0,
      currentKey: '',
      progress: 0,
      time: 0,
      playing: false,
      paused: false,
    });

    document.title = 'tubetop';
  }

  skipPrevious = () => {
    const { current } = this.state;

    if (current > 0) {
      this.audio.pause();
      this.props.dispatch(playSong(current - 1));
    }
  }

  skipNext = () => {
    const { current } = this.state;

    if (current < this.props.songs.length - 1) {
      this.audio.pause();
      this.props.dispatch(playSong(current + 1));
    }
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
    const roundedTime = Math.ceil(this.audio.currentTime);

    if (roundedTime !== time) {
      this.setState({
        time: roundedTime,
      });
    }

    this.setState({
      progress,
    });
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
      this.setState({
        volume: 0,
        savedVolume: volume,
      });
    } else {
      this.setState({
        volume: savedVolume,
      });
    }
  }

  render() {
    const { songs } = this.props;
    const { playing, paused, progress, current, volume } = this.state;

    let duration = 0;

    if (songs[current]) {
      duration = songs[current].duration;
    }

    let volumeIcon;

    if (volume === 0) {
      volumeIcon = <VolumeMute />;
    } else if (volume < 50) {
      volumeIcon = <VolumeDown />;
    } else {
      volumeIcon = <VolumeUp />;
    }

    return (
      <PlayerContainer>
        <audio
          ref={(audio) => { this.audio = audio; }}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.skipNext}
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
          <IconButton aria-label="Previous" onClick={this.skipPrevious}>
            <SkipPrevious />
          </IconButton>

          <PlayButton
            aria-label={playing && !paused ? "Pause" : "Play"}
            onClick={playing && !paused ? this.pause : this.playButton}
          >
            {playing && !paused ? <PauseIcon /> : <PlayIcon />}
          </PlayButton>

          <IconButton aria-label="Next" onClick={this.skipNext}>
            <SkipNext />
          </IconButton>
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

function mapStateToProps(state: any) {
  const songs = state.get('global').get('songs');

  return {
    songs: Array.isArray(songs) ? songs : [],
  };
}

export default connect(mapStateToProps)(Player as any);

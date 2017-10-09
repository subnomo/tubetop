import * as React from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
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
  progress: number;
  time: number;
  volume: number;
  playing: boolean;
  paused: boolean;
}

class Player extends React.PureComponent<IProps, IState> {
  private audio: HTMLAudioElement;

  constructor() {
    super();

    this.state = {
      current: 0,
      progress: 0,
      time: 0,
      volume: 100,
      playing: false,
      paused: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { songs } = this.props;
    const { current } = this.state;

    const currentPlaying = songs.length > 0 && songs[current].playing;
    const nextPlaying = nextProps.songs.length > 0 && nextProps.songs[current].playing;

    // If a new song is playing, find and play it
    if (!currentPlaying) {
      for (let i = 0; i < nextProps.songs.length; i++) {
        if (nextProps.songs[i].playing) {
          this.audio.pause();

          this.setState({
            current: i,
          }, () => { this.play(nextProps); });

          break;
        }
      }
    }

    // If the song has changed, reset state and play
    if (currentPlaying && !nextPlaying) {
      for (let i = 0; i < nextProps.songs.length; i++) {
        if (i === current) continue;

        if (nextProps.songs[i].playing) {
          this.audio.pause();

          this.setState({
            current: i,
            progress: 0,
            time: 0,
            playing: false,
            paused: false,
          }, () => { this.play(nextProps); });

          break;
        }
      }
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

      songs.forEach((song, i) => {
        if (song.playing) {
          current = i;
        }
      });

      this.setState({
        current,
      });

      const song = songs[current];

      // Get song info
      ytdl.getInfo(song.id, (err, info) => {
        if (err) return console.error(err);

        // Get audio only formats
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        let highestQuality = {
          bitrate: 0,
          index: 0,
        };

        // Get best possible quality
        audioFormats.forEach((format, i) => {
          if (format.audioBitrate > highestQuality.bitrate) {
            highestQuality = {
              bitrate: format.audioBitrate,
              index: i,
            };
          }
        });

        // Play the song
        this.audio.src = audioFormats[highestQuality.index].url;
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

    if (roundedTime === songs[current].duration) {
      this.skipNext();
    }

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

  render() {
    const { songs } = this.props;
    const { playing, paused, progress, current } = this.state;

    let duration = 0;

    if (songs[current]) {
      duration = songs[current].duration;
    }

    return (
      <PlayerContainer>
        <audio
          ref={(audio) => { this.audio = audio; }}
          onTimeUpdate={this.handleTimeUpdate}
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
          <IconButton aria-label="Mute">
            <VolumeUp />
          </IconButton>

          <Slider
            value={this.state.volume}
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

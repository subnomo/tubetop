import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import List from 'material-ui/List';

import SongList from '..';
import Song, { SongData } from '../../Song';

describe('<SongList />', () => {
  let testSongs: SongData[];
  let slComponent: ShallowWrapper<any, any>;

  beforeEach(() => {
    testSongs = [
      {
        key: 'test_key',
        id: 'test_id',
        title: 'test_title',
        thumb: 'test_thumb',
        duration: 60,
        playing: false,
      },

      {
        key: 'test_key2',
        id: 'test_id2',
        title: 'test_title2',
        thumb: 'test_thumb2',
        duration: 300,
        playing: true,
      },

      {
        key: 'test_key3',
        id: 'test_id3',
        title: 'test_title3',
        thumb: 'test_thumb3',
        duration: 5000,
        playing: false,
      }
    ];

    slComponent = shallow(
      <SongList songs={testSongs} />
    );
  });

  it('should render a list of <Song /> components', () => {
    const list: JSX.Element = (
      <List>
        <Song
          key={0}
          song={testSongs[0]}
          index={0}
        />

        <Song
          key={1}
          song={testSongs[1]}
          index={1}
        />

        <Song
          key={2}
          song={testSongs[2]}
          index={2}
        />
      </List>
    );

    expect(slComponent.contains(list)).toBe(true);
  });
});

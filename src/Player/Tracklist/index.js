import React from 'react';
import {default as tracks} from '../../assets/Tracklist.json';
import { formatDuration } from '../Bar';
import useAudioPlayer from '../useAudioPlayer';
import {
  Table,
  Row,
  Cell,
} from './styled';

function Tracklist(props) {
  const { setClickedTime } = props;

  return (
    <Table>
        {tracks.map(track => 
          <Row>
            <Cell onClick={() => setClickedTime(track.timecode)} style={{cursor: 'pointer'}}>{formatDuration(track.timecode)}</Cell>
            <Cell>{track.artist}</Cell>
            <Cell>{track.song}</Cell>
            <Cell><a href={track.url} target="_blank" style={{color: 'inherit', textDecoration: 'none'}}>-></a></Cell>
          </Row>
        )}
    </Table>
  )
}

export default Tracklist;

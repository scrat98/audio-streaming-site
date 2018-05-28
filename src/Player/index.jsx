import React from 'react'
import SearchMusic from './SearchMusic'
import MainSong from './MainSong'
import PlayList from './PlayList'
import styled from 'styled-components'
import DragZone from './DragZone'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

class Player extends React.Component {
  mainSongRef = React.createRef()

  state = {
    activeSongFile: null,
    activeSongUrl: null,
    playing: false,
    activeSongTitle: '',
    shuffle: false,
    loop: 'none', // none, once, loop
    music: [],
  }

  componentWillReceiveProps(newProps) {
    this.setState((prevState) => {
      const music = newProps.music
      const activeSongFile = prevState.activeSongFile
      if (!activeSongFile && music.length !== 0) {
        this.setSong(music[0])
        return {
          music: newProps.music,
        }
      }

      return { music: newProps.music }
    })
  }

  playMusic() {
    if (!this.mainSongRef.current) return
    const soundCloudAudio = this.mainSongRef.current.soundCloudAudio
    this.setState({ playing: true })
    soundCloudAudio && soundCloudAudio.play()
  }

  pauseMusic() {
    if (!this.mainSongRef.current) return
    const soundCloudAudio = this.mainSongRef.current.soundCloudAudio
    this.setState({ playing: false })
    soundCloudAudio && soundCloudAudio.pause()
  }

  setSong(song, afterSet = () => {
  }) {
    this.props
      .getSong(song.fileName)
      .then((songUrl) => {
        this.setState({
          activeSongFile: song.fileName,
          activeSongUrl: songUrl,
          activeSongTitle: song.title,
        }, () => {
          if (this.mainSongRef.current) {
            this.mainSongRef.current.componentWillUnmount()
            this.mainSongRef.current.componentDidMount()
            this.pauseMusic()
            afterSet()
          }
        })
      })
  }

  chooseSong = (song) => {
    if (song.fileName !== this.state.activeSongFile) {
      this.setSong(song, () => this.playMusic())
    } else {
      if (!this.state.playing) {
        this.playMusic()
      } else {
        this.pauseMusic()
      }
    }
  }

  nextSong = () => {

  }

  prevSong = () => {

  }

  deleteSong = () => {

  }

  addSong = (song) => {
    this.props.addSong(song)
  }

  onDrop = (files) => {
    files.forEach((file) => {
      this.addSong(file)
    })
  }

  render() {
    return (
      <DragZone onDrop={this.onDrop}>
        <Wrapper>
          <SearchMusic/>
          <PlayList
            music={this.state.music}
            activeSong={this.activeSongFile}
            playing={this.state.playing}
            playSong={this.chooseSong}
            deleteSong={this.deleteSong}
          />
          <MainSong
            streamUrl={this.state.activeSongUrl}
            trackTitle={this.state.activeSongTitle}
            nextSong={this.nextSong}
            prevSong={this.prevSong}
            ref={this.mainSongRef}/>
        </Wrapper>
      </DragZone>
    )
  }
}

export default Player
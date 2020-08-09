import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import MusicFiles from 'react-native-get-music-files';
import MusicPlayerController from 'react-native-musicplayercontroller';

const MusicIntegrationScreen = props=>{	

/*useEffect(()=>{
  (async ()=>{
    try{
     const musicFiles=await MusicFiles.getAll({
            id : true,
            blured : false,
            artist : true,
            duration : true, //default : true
            cover : true, //default : true,
            title : true,
            batchNumber : 5, //get 5 songs per batch
            minimumSongDuration : 10000, //in miliseconds,
            fields : ['title','duration','artist']
        });
     console.log(musicFiles);
     } catch (e) {
      console.log('Exception occurred!!!');
      console.log(e);
    }
  })();
},[]);*/

useEffect(()=>{
(async ()=>{
	 try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
      })
      loadAudio();
    } catch (e) {
      console.log(e);
    }
})();
},[]);

const loadAudio=async ()=>{
  try {
  	console.log("----------Loading Audio--------------");
    const playbackInstance = new Audio.Sound();
    const source = {
      uri: audioBookPlaylist[0].uri
    }

    const status = {
      shouldPlay: "true",
      volume: 1.0
    }
     
    await playbackInstance.loadAsync(source, status, false);
    
    } catch (e) {
      console.log("----------Exception in loading audio-----------------");
      console.log(e);
    }
};

	const audioBookPlaylist = [
  {
    title: 'Hamlet - Act I',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act II',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act III',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri: 'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act IV',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act4_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act V',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  }
]

const handlePlayPause= async()=>{
console.log("------------Song is going to be played soon-----------------");
await playbackInstance.playAsync();
};

	return (
        <View style={styles.container}>
				<Image
					style={styles.albumCover}
					source={{ uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg' }}
				/>
				<View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={handlePlayPause}>
						   <Ionicons name="ios-skip-backward" size={48} color='#444' />
					</TouchableOpacity>
					<TouchableOpacity style={styles.control}>
							<Ionicons name="ios-play" size={48} color='#444'/>
					</TouchableOpacity>
					<TouchableOpacity style={styles.control}>
						<Ionicons name="ios-skip-forward" size={48} color='#444' />
					</TouchableOpacity>
				</View>
			</View>
		);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	albumCover: {
		width: 250,
		height: 250
	},
	trackInfo: {
		padding: 40,
		backgroundColor: '#fff'
	},

	trackInfoText: {
		textAlign: 'center',
		flexWrap: 'wrap',
		color: '#550088'
	},
	largeText: {
		fontSize: 22
	},
	smallText: {
		fontSize: 16
	},
	control: {
		margin: 20
	},
	controls: {
		flexDirection: 'row'
	}
});

export default MusicIntegrationScreen;
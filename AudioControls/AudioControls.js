import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Slider,
    Text,
    Dimensions,
    AsyncStorage,
    StatusBar,
    FlatList,
    ScrollView,
    ToastAndroid
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { 
    Container, 
    Header, 
    Title, 
    Button,
 
    Left, 
    Right, 
    Body, 
    Icon } from 'native-base';

import images from '../config/images';
import colors from '../config/colors';
import AudioController from '../AudioController';
import RenderPlayList from './RenderPlayList'
import Modal from "react-native-modal";
import RNFetchBlob from 'react-native-fetch-blob'
const { width } = Dimensions.get('window');

class AudioControls extends Component {
    static defaultProps = {
        ...Component.defaultProps,

        //SKIP SECONDS
        hasButtonSkipSeconds: false,
        timeToSkip: 15,

        //THUMBNAIL
        thumbnailSize: {
            width: width * 0.6,
            height: width * 0.6
        },

        //SOUND
        titleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.white
        },
        authorStyle: {
            fontSize: 15,
            color: '#bdc3c7'
        },

        //COLORS
        activeColor: colors.white,
        inactiveColor: colors.grey,

        //BUTTONS
        activeButtonColor: null,
        inactiveButtonColor: null,

        //SLIDER
        sliderMinimumTrackTintColor: '#c0392b',
        sliderMaximumTrackTintColor: null,
        sliderThumbTintColor: '#c0392b',
        sliderTimeStyle: {
            fontSize: 12,
            color: colors.white,
            marginTop : 2
        }
    }

    constructor(props) {
        super(props);
       // let s = await AsyncStorage.getItem('statusSong')
          
   // if(!AudioController.currentAudio.hasOwnProperty('key')){
      //  console.log(AudioController.currentAudio)
    
        this.state = {
            
            duration: AudioController.currentAudio.hasOwnProperty('key') ? AudioController.currentAudio.duration  : 0,
            currentTime: AudioController.currentAudio.hasOwnProperty('key') ? AudioController.currentAudio.currentTime  : 0,
            currentAudio: AudioController.currentAudio.hasOwnProperty('key') ? AudioController.currentAudio  : {},
            isReady: true,
            isPlaying:  false,
            isModalVisible: false
        };

        
    }

    _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible }
    );

   async componentWillMount() {
        let s = await AsyncStorage.getItem('statusSong')
        
        if(s == 'play'){
            this.setState({isPlaying : true})
        }else{
            this.setState({isPlaying : false})
        }

        if(!AudioController.currentAudio.hasOwnProperty('key')){
            console.log(AudioController.currentAudio)
            const { playlist, initialTrack } = this.props;
            AudioController.init(playlist, initialTrack, this.onChangeStatus, this.updateCurrentTime);
         }
          else{
            console.log(AudioController.currentAudio)
              AudioController.init1(this.onChangeStatus, this.updateCurrentTime);

          }
       
    }

    onChangeStatus = (status) => {
        switch (status) {
            case AudioController.status.PLAYING:
                this.setState({ isPlaying: true });
                break;
            case AudioController.status.PAUSED:
                this.setState({ isPlaying: false });
                break;
            case AudioController.status.STOPPED:
                this.setState({ isPlaying: false });
                break;
            case AudioController.status.LOADED:
                AudioController.getDuration((seconds) => {
                    console.log(seconds)
                    this.setState({ duration: seconds });
                });
                this.setState({ currentAudio: AudioController.currentAudio });
                break;
            case AudioController.status.ERROR:
                console.log('Status Error');
                break;
            default:
                return;
        }
    }

    updateCurrentTime = (seconds) => {
        //    if(seconds >= this.state.duration)
        //    AudioController.playNext()
        this.setState({ currentTime: seconds });
    }

    renderPlayerIcon() {
        const { isPlaying } = this.state;
        if (isPlaying) {
            return (
                <TouchableOpacity
                    onPress={() =>{
                          AsyncStorage.setItem('statusSong' , 'pause')
                        AudioController.pause()}}
                >
                    <Image
                        source={images.iconPause}
                        style={[
                            styles.playButton,
                            { tintColor: this.props.activeButtonColor || this.props.activeColor  , marginLeft : 15 , marginRight : 15}
                        ]}
                    />
                </TouchableOpacity >
            );
        }

        return (
            <TouchableOpacity
                onPress={() =>{
                     AsyncStorage.setItem('statusSong' , 'play')
                    AudioController.play()}}
            >
                <Image
                    source={images.iconPlay}
                    style={[
                        styles.playButton,{ marginLeft : 15 , marginRight : 15}
                    ]}
                />
            </TouchableOpacity >
        );
    }

    renderNextIcon() {
        if (AudioController.hasNext()) {
            return (
                <TouchableOpacity onPress={() => AudioController.playNext()}>
                    <Image
                        source={images.iconNext}
                        style={[
                            styles.controlButton,
                            { tintColor: this.props.activeButtonColor || this.props.activeColor }
                        ]}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <Image
                source={images.iconNext}
                style={[
                    styles.controlButton,
                    { tintColor: this.props.inactiveButtonColor || this.props.inactiveColor }
                ]}
            />
        );
    }

    renderPreviousIcon() {
        if (AudioController.hasPrevious()) {
            return (
                <TouchableOpacity onPress={() =>{
                    AudioController.pause()
                    AudioController.playPrevious()
                }}>
                    <Image
                        source={images.iconPrevious}
                        style={
                            [styles.controlButton,
                            { tintColor: this.props.activeButtonColor || this.props.activeColor }
                            ]}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <Image
                source={images.iconPrevious}
                style={[
                    styles.controlButton,
                    { tintColor: this.props.inactiveButtonColor || this.props.inactiveColor }
                ]}
            />
        );
    }

    renderLikeIcon() {
            return (
                <TouchableOpacity onPress={() =>{
                    
                }}>
                    <Image
                        source={images.iconLike}
                        style={
                            [styles.controlButton,
                            {tintColor : '#c0392b'}]}
                    />
                </TouchableOpacity>
            );
    }

    renderDislikeIcon() {
            return (
                <TouchableOpacity onPress={() =>{
                   
                }}>
                    <Image
                        source={images.iconDislike}
                        style={
                            [styles.controlButton,
                            ]}
                    />
                </TouchableOpacity>
            );
    }


    renderSkipbackwardIcon() {
        if (!this.props.hasButtonSkipSeconds) return;
        return (
            <TouchableOpacity
                onPress={() => {
                    AudioController.seekToForward(-this.props.timeToSkip);
                }}
            >
                <Image
                    source={images.skipBackward}
                    style={[
                        styles.controlButton,
                        { tintColor: this.props.activeButtonColor || this.props.activeColor }
                    ]}
                />
            </TouchableOpacity>
        );
    }

    renderSkipforwardIcon() {
        if (!this.props.hasButtonSkipSeconds) return;
        return (
            <TouchableOpacity
                onPress={() => {
                    AudioController.seekToForward(this.props.timeToSkip);
                }}
            >
                <Image
                    source={images.skipForward}
                    style={[styles.controlButton, { tintColor: this.props.activeButtonColor || this.props.activeColor }]}
                />
            </TouchableOpacity>
        );
    }

    renderDownloadIcon() {
        
        return (
            <TouchableOpacity
                onPress={this._toggleModal}
            >
                <Image
                    source={images.iconDownload}
                    style={[styles.controlButton]}
                />
            </TouchableOpacity>
        );
    }
    
    renderAddListIcon() {
        
        return (
            <TouchableOpacity
                onPress={() => {
                   
                }}
            >
                <Image
                    source={images.iconAddList}
                    style={{
                        width: 25,
                        height: 25,
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop : 10
                    }}
                />
            </TouchableOpacity>
        );
    }



    goToTop = () => {
        this.scroll.scrollTo({x: 0, y: 0, animated: true});
     }

     
    render() {
        const { currentTime, duration, currentAudio } = this.state;
      
        

return (


    <View style={{}}>
            <ScrollView
            ref={(c) => {this.scroll = c}}
        >

   

        <View style={{ flex : .2 ,backgroundColor : '#2C2C2C' , width : '100%' , height : 50}}>
            <StatusBar backgroundColor = '#2C2C2C' />

            <View style={{flex : 1 , flexDirection : 'row'}}>

           
           <View style={{flex :.2 ,justifyContent : 'center' , alignItems : 'center'}}>
            <Button transparent>
              <Icon name='ios-arrow-down-outline' style={{color : 'white', fontSize : 27}}  />
            </Button>
            </View>
            


            <View style={{flex :.9 ,justifyContent : 'center' , alignItems : 'center'}}>
            <Text style={{color : 'white',fontSize : 16}}>
                {currentAudio.author}
            </Text>
            </View>


            <View style={{flex :.2 ,justifyContent : 'center' ,marginLeft : 3}}>

            <Button transparent>
              <Icon name='md-more' style={{color : 'white' ,fontSize : 25}} />
            </Button>
            </View>

        </View>
            </View>



            <View style={styles.container}>
                <Image
                    source={currentAudio.thumbnailUri ? { uri: currentAudio.thumbnailUri } : currentAudio.thumbnailLocal}
                    style={[this.props.thumbnailSize,{marginTop : 20}]}
                />
                <View style={styles.detailContainer}>
                    <Text style={this.props.titleStyle}>{currentAudio.title}</Text>
                    <Text style={this.props.authorStyle}>{currentAudio.author}</Text>
                </View>
                <View style={styles.playbackContainer}>
                    <Text numberOfLines={1} style={this.props.sliderTimeStyle}>
                        {currentTime ? moment.utc(currentTime * 1000).format('mm:ss') : '00:00'}
                    </Text>
                    <Slider
                        value={currentTime}
                        maximumValue={duration}

                        style={styles.playbackBar}

                        minimumTrackTintColor={this.props.sliderMinimumTrackTintColor ||
                            this.props.activeColor}
                        maximumTrackTintColor={this.props.sliderMaximumTrackTintColor ||
                            this.props.inactiveColor}
                        thumbTintColor={this.props.sliderThumbTintColor || this.props.activeColor}

                        onSlidingComplete={seconds => {
                            AudioController.seek(seconds);
                            if (seconds < duration) AudioController.play();
                        }}

                        onValueChange={() => AudioController.clearCurrentTimeListener()}
                    />
                    <Text numberOfLines={1} style={this.props.sliderTimeStyle}>
                        {duration ? moment.utc(duration*1000  ).format('mm:ss') : '00:00'}
                    </Text>
                </View>
                <View style={[styles.buttonsContainer,{marginBottom : 30}]}>
                    {this.renderSkipbackwardIcon()}
                    {this.renderAddListIcon()}
                    {this.renderLikeIcon()}
                    {this.renderPreviousIcon()}
                    {this.renderPlayerIcon()}
                    {this.renderNextIcon()}
                    {this.renderDislikeIcon()}
                    {this.renderDownloadIcon()}
                    {this.renderSkipforwardIcon()}
                </View>

            </View>
            <View>
            <FlatList
                    data ={this.props.playlist}
                    renderItem ={this.renderItem}
                    keyExtractor = { ( value , index ) => index}
                    numColumns = {1}
            />
            </View>

            <Modal isVisible={this.state.isModalVisible}
                    backdropColor={"black"}
                    backdropOpacity={0.80}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={400}
                    backdropTransitionOutTiming={400}
            >
          <View style={styles.downloadModlaC}>

                
                  <Text  style={styles.downloadModlaText}>Chose Your Formt </Text>          



                <Button style={styles.downloadModalButton} onPress={this._toggleModal} disabled>
                    <View style={styles.downloadModalButtonView}>
                        <Text style={{color : 'white' , fontSize : 20 }}>320</Text>
                    </View>
                    
                </Button>

                <Button style={styles.downloadModalButton} onPress={() => this.downloadFile(128)}>
                <View style={styles.downloadModalButtonView}>
                        <Text style={{color : 'white' , fontSize : 20 }}>128</Text>
                    </View>
                </Button>

                <Button style={styles.downloadModalButtonClose} onPress={this._toggleModal}>
                <View style={styles.downloadModalButtonView}>
                <Text style={{color : 'white' , fontSize : 20 }}>close</Text>
                    </View>
                </Button>
            


          </View>
        </Modal>


</ScrollView>
            </View>
            

        );
    }

    renderItem( {item,index} ) {
        return <RenderPlayList playList={{item , index}} />
    }

   async  downloadFile(format){
     

        const { config, fs } = RNFetchBlob

       let exsit = await  fs.exists(fs.dirs.DownloadDir + '/'+this.state.currentAudio.title +'-' + this.state.currentAudio.author+'-'+format+'.mp3')
        if( exsit ){
            this._toggleModal()
            ToastAndroid.show('This music has already been downloaded !', ToastAndroid.SHORT);
            return;
        }

       
        let date = new Date()
        let PictureDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
          fileCache: true,
          addAndroidDownloads : {
            useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification : true,
            path:  PictureDir + '/'+this.state.currentAudio.title +'-' + this.state.currentAudio.author+'-'+format+'.mp3', // this is the path where your downloaded file will live in
            description : 'Music X '
          }
        }
        config(options).fetch('GET', this.state.currentAudio.url).then((res) => {
          // do some magic here
        })

        this._toggleModal()
      
        
    
 }
}

const styles = StyleSheet.create({
    container: {
     flex : .8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#222222',
       
    },
   downloadModlaC :  { 
       flex: 1 , 
       justifyContent : 'center' ,
       alignItems : 'center' ,
       alignSelf :'center'
    },
    downloadModlaText : {
        color : 'white' ,
         fontSize : 25 ,
         marginBottom : 30
    },
    downloadModalButton : {
        width : 200 ,
        height : 60 , 
        marginBottom : 5 ,
        backgroundColor : '#2d3436'
        },

    downloadModalButtonView : {
        flex : 1 , 
        alignItems : 'center' ,
        alignSelf : 'center'
        },

    downloadModalButtonClose : {
        width : 150 ,
        height : 60  ,
        marginTop : 20 ,
        backgroundColor : '#2d3436',
        alignSelf :'center'
        },
    detailContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginVertical: 10
    },
    playbackContainer: {
        flexDirection: 'row'
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop : 10
    },


    playbackBar: {
        width: '75%'
    },
    playButton: {
        width: 30,
        height: 30
    },
    controlButton: {
        width: 20,
        height: 20,
        marginLeft: 13,
        marginRight: 13,
        marginTop : 10
    }
});

export default AudioControls;

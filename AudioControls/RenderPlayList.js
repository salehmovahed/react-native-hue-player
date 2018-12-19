import React,{Component} from 'react'
import { View , Text ,StyleSheet ,Image ,StatusBar ,TouchableNativeFeedback } from 'react-native'
import { Header , Body, Left, Icon } from 'native-base'
import AudioController from '../AudioController';

export default class RenderPlayList extends Component {

    render() {

            
        console.log(this.props)
      const { title , author , thumbnailUri  } = this.props.playList.item
      const index = this.props.playList.index
         return (
          <View>
          <TouchableNativeFeedback
              onPress={() => {
                AudioController.playAnotherTrack(index)
              }}
              >
            <View style={styles.itemContaine}>
              <View style={styles.item}>
             

                <View style={styles.imageC}>
                        <Image source={{uri : thumbnailUri}} style={styles.image} />
                </View>

             
                <View style={styles.textC}>
                  <Text style={styles.text}>{title}</Text>
                  <Text style={styles.textName}>{author}</Text>
                </View>

                < View style={styles.iconC}>
                  <Icon name='ios-musical-notes-outline' style={{ margin : 10 , color : 'white' ,fontSize  : 25}}/>
                </View>
                
              </View>
            </View>
            </TouchableNativeFeedback>
            </View>
        )
      }

}


const styles = StyleSheet.create({
    itemContaine :{
      width : '100%' ,
      height : 80 , 
      backgroundColor : '#181818' ,
    },
    item :{
      flex : 1 ,
      flexDirection  :'row' , 
      height : 80
    },
    iconC :{
      flex : .2 ,
      justifyContent : 'center',
      alignItems : 'center'
     },
    textC :{flex : .5 ,
      justifyContent : 'center'
     },
    text :{
      fontFamily : 'Shabnam' ,
      fontSize: 17,
      textAlign : 'left',
      color : 'white'
      },
      textName :{
        fontFamily : 'Shabnam' ,
        fontSize: 13,
        textAlign : 'left',
        color : '#bdc3c7',
        marginTop : 3
        },
    imageC :{
      flex : .3 ,
      justifyContent : 'center' ,
      alignItems : 'center' 
      },
    image :{
      width: 68,
      height: 68,
      margin: 5 ,
      borderRadius : 4
    }
})



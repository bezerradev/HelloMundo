/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import firebase from 'react-native-firebase';

type Props = {};
export default class App extends Component<Props> {
  state = {
      nome: '',
      key: '',
  }

  async componentDidMount() {
    this.checkPermission();
  }

  async checkPermission() {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
            console.log("token: ", fcmToken);
            this.getToken();
    } else {
            this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({key: fcmToken});

    console.log("before: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("after: ", fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  handleNome = (text) => {
    this.setState({ nome: text });
  }

  adicionar = (nome) => {
    fetch('https://sci-prototipo.herokuapp.com/adicionar', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
              'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      nome: nome,
      key: this.state.key,
      }),
      }).then((response) => response.json())
    .then((responseJson) => {
        return responseJson.status;
      })
    .catch((error) => {
        console.error(error);
    });
  }

  

  render() {
    return (
        <View style = {styles.container}>
        <TextInput style = {styles.input}
        underlineColorAndroid = "transparent"
        placeholder = "Nome"
        placeholderTextColor = "#9a73ef"
        autoCapitalize = "none"
        onChangeText = {this.handleNome}/>

        <TouchableOpacity
        style = {styles.submitButton}

        onPress = {() => this.adicionar(this.state.nome)}>

        <Text style = {styles.submitButtonText}>Inscrever-se</Text>
        </TouchableOpacity>
        </View>
    )
  }
}


const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 15,
      height: 40,
   },
   submitButtonText:{
      color: 'white'
   }
});

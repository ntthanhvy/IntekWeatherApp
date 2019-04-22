import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Picker,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Constants } from 'expo';

const citiesInfo = require('./city.json');

export default class App extends React.Component {
  // the main state of the app
  constructor(props) {
    super(props);
    this.state = {
      citiesList: citiesInfo,
      currCity: citiesInfo[0].name,
      currId: citiesInfo[0].id,
      loaded: false,
      search: false,
    };
  }

  _state = {
    currCity: citiesInfo[0].name,
    currId: citiesInfo[0].id,
  };

  // get weather info
  _getWeatherInfo(id) {
    return fetch(
      'https://api.openweathermap.org/data/2.5/weather?id=' +
        id +
        '&units=metric&appid=93e22ff037c57436b96d1d61b335d8f4'
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log('get api');
        // console.log(responseJson);
        this.setState(state => {
          return { loaded: true, dataSrc: responseJson };
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // the call api test method
  _testApi() {
    this.dataSrc = 'valid result';
    this.setState(state => {
      return { loaded: true };
    });
  }

  // change picker value
  _changeValue = index => {
    this._state.currCity = this.state.citiesList[index].name;
    this._state.currId = this.state.citiesList[index].id;
    // console.log(this._state.currCity);
    this.setState({
      currCity: this.state.citiesList[index].name,
      currId: this.state.citiesList[index].id,
    });
    // console.log('1. ');
    // console.log(this.state);
    this._getWeatherInfo(this._state.currId);
  };

  // search value from input
  _searchValue = text => {
    // const newData = citiesInfo.filter(item => {
    //   const itemData = item.name.toLowerCase();
    //   const textData = text.toLowerCase();
    //   return itemData.indexOf(textData) > -1;
    // });
    this.setState({
      citiesList: citiesInfo.filter((item) => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      }),
      currCity: text,
    });
  };

  // load the api response
  _loadResult = () => {
    if (this.state.loaded === true) {
      let id = this.state.dataSrc.weather[0].icon;
      return (
        <View
          style={styles.weatherInfo}
          itemStyle={{ borderWidth: 1, borderColor: '#5a98fc' }}>
          <Text
            style={{ fontSize: 20, fontWeight: '500', textAlign: 'center' }}>
            Weather in {this.state.dataSrc.name}
          </Text>
          <Text style={styles.weatherInfoComponent}>
            Cloudiness: {this.state.dataSrc.weather[0].description}
          </Text>
          <Image
            source={{ uri: 'http://openweathermap.org/img/w/' + id + '.png' }}
            style={{ width: 100, height: 100 }}
          />
          <Text style={styles.weatherInfoComponent}>
            Temperture: {this.state.dataSrc.main.temp}&#176;C
          </Text>
          <Text style={styles.weatherInfoComponent}>
            Pressure: {this.state.dataSrc.main.pressure} hPa
          </Text>
          <Text style={styles.weatherInfoComponent}>
            Humidity: {this.state.dataSrc.main.humidity}%
          </Text>
          <Text style={styles.weatherInfoComponent}>
            Wind speed: {this.state.dataSrc.wind.speed} meter/sec
          </Text>
        </View>
      );
    } else {
      this._getWeatherInfo(this._state.currId);
    }
  };

  // the render method to render to screen
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.currCity}
          onChangeText={text => {
            this._searchValue(text);
          }}
          // onSubmitEditing={({ nativeEvent }) => {
          //   this._searchValue(nativeEvent.text);
          // }}
        />
        <Picker
          style={styles.picker}
          itemStyle={styles.itemPicker}
          onValueChange={(itemValue, itemIndex) => {
            this._changeValue(itemIndex);
            // console.log('out');
            // console.log(this._state.currCity);
            // this._getWeatherInfo(this._state.currId);
          }}
          selectedValue={this.state.currId}>
          {this.state.citiesList.map(city => {
            return <Picker.Item label={city.name} value={city.id} />;
          })}
        </Picker>
        <ScrollView>{this._loadResult()}</ScrollView>
      </View>
    );
  }
}

// the syltes attribute of component in the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  input: {
    margin: 12,
    marginBottom: 0,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    marginHorizontal: 20,
  },
  itemPicker: {
    height: 150,
  },
  weatherInfo: {
    margin: 10,
    padding: 20,
    backgroundColor: '#59C4EB',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  weatherInfoComponent: {
    textColor: '#e0f6ff',
    fontSize: 18,
  }
});

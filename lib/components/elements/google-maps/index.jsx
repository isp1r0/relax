import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';

import propsSchema from './props-schema';
import settings from './settings';
import Component from '../../component';
import Element from '../../element';
import Utils from '../../../utils';

export default class GoogleMapsElem extends Component {
  static propTypes = {
    zoom: React.PropTypes.number.isRequired,
    lat: React.PropTypes.string.isRequired,
    lng: React.PropTypes.string.isRequired,
    height: React.PropTypes.number.isRequired,
    scrollwheel: React.PropTypes.bool.isRequired,
    zoomControls: React.PropTypes.bool.isRequired,
    mapTypeControl: React.PropTypes.bool.isRequired,
    streetViewControl: React.PropTypes.bool.isRequired,
    useMarker: React.PropTypes.bool.isRequired,
    selected: React.PropTypes.bool.isRequired,
    pageBuilder: React.PropTypes.object
  }

  static defaultProps = {
    zoom: 15,
    lat: '41.1761671',
    lng: '-8.601692',
    height: 250,
    scrollwheel: false,
    zoomControls: true,
    mapTypeControl: false,
    streetViewControl: true,
    useMarker: true
  }

  static propsSchema = propsSchema
  static settings = settings

  getInitialState () {
    return {
      ready: this.loadAPI()
    };
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return (
  //     this.props.pageBuilder.editing && this.props.selected ||
  //     nextState.ready !== this.state.ready
  //   );
  // }

  componentDidUpdate (prevProps) {
    if (this.props.pageBuilder && this.props.pageBuilder.editing && this.state.ready && prevProps.height !== this.props.height) {
      if (this.refs.map && this.refs.map.state && this.refs.map.state.instance) {
        window.google.maps.event.trigger(this.refs.map.state.instance, 'resize');
      }
    }
  }

  loadAPI () {
    let result = false;
    if (typeof document !== 'undefined') {
      if (!Utils.hasClass(document.body, 'googleMapsInitiated') && !Utils.hasClass(document.body, 'googleMapsLoading')) {
        Utils.addClass(document.body, 'googleMapsLoading');

        window.googleMapsInitiated = function () {
          Utils.removeClass(document.body, 'googleMapsLoading');
          Utils.addClass(document.body, 'googleMapsInitiated');
          /* jshint ignore:start */
          window.dispatchEvent(new Event('googleMapsInitiated'));
          /* jshint ignore:end */
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=googleMapsInitiated';
        document.body.appendChild(script);

        window.addEventListener('googleMapsInitiated', this.onReady.bind(this));
      } else if (!Utils.hasClass(document.body, 'googleMapsInitiated')) {
        window.addEventListener('googleMapsInitiated', this.onReady.bind(this));
      } else {
        result = true;
      }
    }
    return result;
  }

  onReady () {
    this.setState({
      ready: true
    });
  }

  render () {
    return (
      <Element info={this.props} htmlTag='div' settings={settings}>
        {this.renderMap()}
      </Element>
    );
  }

  renderMap () {
    if (this.state.ready) {
      let result;
      const editing = this.props.pageBuilder && this.props.pageBuilder.editing;
      const key = this.props.zoom + this.props.scrollwheel + this.props.zoomControls + this.props.streetViewControl + this.props.mapTypeControl + this.props.lat + this.props.lng;

      const gmap = (
        <GoogleMap
          ref='map'
          containerProps={{
            style: {
              height: this.props.height
            }
          }}
          googleMapsApi={window.google.maps}
          options={{
            scrollwheel: this.props.scrollwheel,
            zoomControl: this.props.zoomControls,
            streetViewControl: this.props.streetViewControl,
            mapTypeControl: this.props.mapTypeControl
          }}
          zoom={this.props.zoom}
          center={{lat: parseFloat(this.props.lat, 10), lng: parseFloat(this.props.lng, 10)}}
          key={key}
        >{this.renderMarker()}</GoogleMap>
      );

      if (editing) {
        result = (
          <div className='editing-wrapper'>
            {gmap}
            <div className='editing-cover'></div>
          </div>
        );
      } else {
        result = gmap;
      }
      return result;
    }
  }

  renderMarker () {
    if (this.props.useMarker) {
      const position = {
        lat: parseFloat(this.props.lat, 10),
        lng: parseFloat(this.props.lng, 10)
      };
      return (
        <Marker position={position} key={this.props.lat + this.props.lng} />
      );
    }
  }
}

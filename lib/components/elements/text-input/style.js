import Utils from '../../../utils';
import {Types} from '../../../data-types';
import {getColorString} from '../../../helpers/colors';

export default {
  type: 'input',
  options: [
    {
      label: 'Background',
      type: 'Section',
      id: 'backgroundSection',
      unlocks: [
        {
          label: 'Background Color',
          type: 'Optional',
          id: 'useBackground',
          unlocks: [
            {
              type: Types.Color,
              id: 'backgroundColor'
            }
          ]
        },
        {
          label: 'Padding',
          type: Types.Padding,
          id: 'padding'
        },
        {
          label: 'Border',
          type: 'Optional',
          id: 'useBorder',
          unlocks: [
            {
              label: 'Border',
              type: Types.Border,
              id: 'border'
            },
            {
              label: 'Border color on focused',
              type: Types.Color,
              id: 'borderColorFocused'
            }
          ]
        },
        {
          label: 'Rounded Corners',
          type: 'Optional',
          id: 'useCorners',
          unlocks: [
            {
              type: Types.Corners,
              id: 'corners'
            }
          ]
        }
      ]
    },
    {
      label: 'Layout',
      type: 'Section',
      id: 'layoutSection',
      unlocks: [
        {
          label: 'Width',
          type: Types.Select,
          id: 'width',
          props: {
            labels: ['Full width', 'Max Width'],
            values: ['full', 'max']
          },
          unlocks: {
            max: [
              {
                label: 'Max Width',
                id: 'maxWidth',
                type: Types.Pixels
              },
              {
                label: 'Align',
                id: 'align',
                type: Types.Select,
                props: {
                  labels: ['Left', 'Center', 'Right'],
                  values: ['left', 'center', 'right']
                }
              }
            ]
          }
        }
      ]
    },
    {
      label: 'Text',
      type: 'Section',
      id: 'textSection',
      unlocks: [
        {
          label: 'Font Family',
          id: 'font',
          type: Types.Font
        },
        {
          label: 'Font Size',
          id: 'fontSize',
          type: Types.Pixels
        },
        {
          label: 'Line Height',
          id: 'lineHeight',
          type: Types.Pixels
        },
        {
          label: 'Letter Spacing',
          id: 'letterSpacing',
          type: Types.Pixels
        },
        {
          label: 'Color',
          id: 'color',
          type: Types.Color
        },
        {
          label: 'Text align',
          id: 'textAlign',
          type: Types.Select,
          props: {
            labels: ['Left', 'Center', 'Right'],
            values: ['left', 'center', 'right']
          }
        }
      ]
    }
  ],
  defaults: {
    useBackground: false,
    backgroundColor: {
      value: '#ffffff',
      opacity: 100
    },
    padding: '10px',
    useBorder: false,
    border: false,
    borderColorFocused: {
      value: '#333333',
      opacity: 100
    },
    useCorners: false,
    corners: '0px',
    width: 'max',
    maxWidth: 300,
    align: 'left',
    font: {},
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    color: {
      value: '#ffffff',
      opacity: 100
    },
    textAlign: 'left'
  },
  rules: (props) => {
    const style = {
      input: {
        backgroundColor: props.useBackground && getColorString(props.backgroundColor),
        borderRadius: props.useCorners && props.corners,
        padding: props.padding,
        fontSize: props.fontSize + 'px',
        lineHeight: props.lineHeight + 'px',
        color: getColorString(props.color),
        letterSpacing: props.letterSpacing + 'px',
        textAlign: props.textAlign,
        ':focus': {
          borderColor: props.useBorder && getColorString(props.borderColorFocused)
        }
      },
      holder: {
        textAlign: props.align
      }
    };

    if (props.useBorder) {
      Utils.applyBorders(style.input, props.border);
    }

    if (props.width === 'max') {
      style.input.width = props.maxWidth + 'px';
    }

    if (props.font && props.font.family && props.font.fvd) {
      style.input.fontFamily = props.font.family;
      Utils.processFVD(style.input, props.font.fvd);
    }

    return style;
  }
};

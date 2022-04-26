const props = {
    'createOrg': {
        struct:'collection',
        parent:'self',
        fn:'add'
    }, 
    'name': {
        struct:'org',
        parent:'self'
    }, 
    'children': {
        struct:'org',
        parent:'self'
    }, 
    'center': {
        parent:'self'
    },
    'color': {
        parent:'self'
    },
    'movement': {
        parent:'self'
    },
    'size': {
        parent:'self'
    },
    'merge': {
        parent:'self'
    },
    
    'distortion': {
        parent:'self'
    },
    'centerx': {
        struct:'org',
        parent:'center'
    },
    'centery': {
        struct:'org',
        parent:'center'
    },
    'sizevalue': {
        struct:'org',
        parent:'size'
    },
    'grows': {
        struct:'org',
        parent:'size'
    },
    'maxGrowth': {
        struct:'org',
        parent:'size'
    },
    'growthSpeed': {
        struct:'org',
        parent:'size'
    },
    'colortype': {
        struct:'org',
        parent:'color'
    },
    'r': {
        struct:'org',
        parent:'color'
    },
    'g': {
        struct:'org',
        parent:'color'
    },
    'b': {
        struct:'org',
        parent:'color'
    },
    'grains': {
        struct:'org',
        parent:'color'
    },
    'glow': {
        struct:'org',
        parent:'color'
    },
    'intensity': {
        struct:'org',
        parent:'color'
    },
    'speed': {
        struct:'org',
        parent:'movement'
    },
    'movementtype': {
        struct:'org',
        parent:'movement'
    },
    'moves': {
        struct:'org',
        parent:'movement'
    },
    'distortiontype': {
        struct:'org',
        parent:'distortion'
    },
    'frequency': {
        struct:'org',
        parent:'distortion'
    },
    'amplitude': {
        struct:'org',
        parent:'distortion'
    },
    'angle': {
        struct:'org',
        parent:'speed'
    },
    'speedval': {
        struct:'org',
        parent:'speed'
    },
    'delta': {
        struct:'org',
        parent:'speed'
    },
    'rad': {
        struct:'org',
        parent:'speed'
    },
    'mergeorgs': {
        struct:'org',
        parent:'merge'
    }
}
export default props;
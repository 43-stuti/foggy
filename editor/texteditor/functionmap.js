//set no of orgs and arg values
const map = {
    'devise': {
        fn:'CREATE',
        parser:'parseWorld'
    },
    'fuse': {
        fn:'FUSE',
        parser:'parseMerge'
    },
    'locate': {
        fn:'LOCATE',
        parser:'parseLocation'
    },
    'growsat': {
        fn:'GROWSAT',
        parser:'parseSize'
    },
    'grows to': {
        fn:'GROWSTO',
        parser:'parseSize'
    },
    'setsize': {
        fn:'SETSIZE',
        parser:'parseSize'
    },
    'move': {
        fn:'MOVE',
        parser:'parseMovement'
    },
    'glow': {
        fn:'GLOW',
        parser:'parseColor'
    },
    'swirl': {
        fn:'SWIRL',
        parser:'parseColor'
    },
    'setcolor': {
        fn:'SETCOLOR',
        parser:'parseColor'
    },
    'amplitude': {
        fn:'AMPLITUDE',
        parser:'parseColor'
    },
    'frequency': {
        fn:'FREQUENCY',
        parser:'parseColor'
    }
}
export default map;
//set no of orgs and arg values
const map = {
    'spawn': {
        fn:'create',
        parser:'parseWorld'
    },
    'habitat': {
        fn:'locate',
        args:['centerx','centery']
    },
    'size': {
        fn:'setsize',
        args:['sizevalue']
    },
    'pigment': {
        fn:'setcolor',
        args:['r','g','b']
    },
    'distort': {
        fn:'DISTORT',
        args:['amplitude','frequency']
    },
    'growth': {
        fn:'growth',
        args:['grows','maxgrowth','growthspeed']
    },
    'move': {
        fn:'move',
        parser:'parseMovement',
        args:['angle','distance']
    },
    'move~': {
        fn:'move~',
        parser:'parseMovement',
        args:['delta','distance']
    },
    'fuse': {
        fn:'fuse',
        parser:'parseMerge'
    },
    //patterns
    //mix them to one
    'glow': {
        fn:'glow',
        parser:'parseColor',
        args:['glow','intensity']
    },
    '!glow': {
        fn:'!glow',
        parser:'parseColor'
    },
    'swirl': {
        fn:'swirl',
        parser:'parseColor',
        args:['grains']
    },
    '!swirl': {
        fn:'swirl',
        parser:'!parseColor'
    },
   
    
}
export default map;

/*
make 
*/
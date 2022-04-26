//set no of orgs and arg values
const map = {
    'devise': {
        fn:'create',
        parser:'parseWorld'
    },
    'locate': {
        fn:'locate',
        args:['centerx','centery']
    },
    'setsize': {
        fn:'setsize',
        args:['sizevalue']
    },
    'setcolor': {
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
        fn:'GLOW',
        parser:'parseColor'
    },
    'swirl': {
        fn:'SWIRL',
        parser:'parseColor'
    },
   
    
}
export default map;

/*
make 
*/
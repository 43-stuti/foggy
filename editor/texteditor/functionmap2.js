//set no of orgs and arg values
const map = {
    'grow': {
        fn:'create',
        parser:'parseGrowth'
    },
    'distort': {
        fn:'create',
        parser:'parseDistort'
    },
    'move': {
        fn:'create',
        parser:'parseMovement'
    },
    'pigment': {
        fn:'create',
        parser:'parseColor'
    },
    'merge': {
        fn:'create',
        parser:'parseMerge'
    }
}
export default map;

/*
make 
*/
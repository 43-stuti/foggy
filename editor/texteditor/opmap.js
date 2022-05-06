const opMap = {
    '+' : {
        fn:'grow'
    },
    '%' : {
        fn:'merge'
    },
    '-' : {
        fn:'distort'
    },
    '/' : {
        fn:'move'
    },
    '*' : {
        fn:'pigment'
    }
}
export default opMap

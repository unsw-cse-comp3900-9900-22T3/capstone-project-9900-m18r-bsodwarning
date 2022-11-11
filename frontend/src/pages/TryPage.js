// import * as React from 'react';

// export default function TryPage(){
//   const [count, setCount] = React.useState(0)
//   const btnRef = React.useRef(null)

//   React.useEffect(() => {
//       console.log('use effect...')
//       const onClick = ()=>{
//           setCount(count+1)
//       }
//       btnRef.current.addEventListener('click',onClick, false)
//       return ()=> btnRef.current.removeEventListener('click',onClick, false)
//   },[count])

//     return(
//         <div>
//             <div>
//                 {count}
//             </div>
//             <button ref={btnRef}>click me </button>
//         </div>
//     )
// }
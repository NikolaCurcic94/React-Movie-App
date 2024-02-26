import React, { useEffect, useState } from 'react'

const useWindowResize = () => {
    const [screenWidth, setScreenWidth] = useState({ width: 0 })

    useEffect(() => {
        const resizeHandler = () => {
            setScreenWidth({ width: window.innerWidth })
        }
        window.addEventListener('resize', resizeHandler)
        resizeHandler()
        // console.log(resizeHandler())
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])
    return screenWidth
}

export default useWindowResize
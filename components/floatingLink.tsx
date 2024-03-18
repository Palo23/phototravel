import { useEffect, useRef, useState } from 'react';
import Link from "next/link"
import { FaExternalLinkAlt, FaArrowUp, FaChevronDown, FaChevronUp } from "react-icons/fa"
import autoAnimate from '@formkit/auto-animate';
import { motion } from 'framer-motion';

const FloatingLink = (props: { href: string, text: string }) => {
    const { href, text } = props;
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    return (
        <div className="relative">
            <div className="absolute top-0 right-2">
              <div className='bg-gray-700 p-2 text-white' onClick={() => setIsButtonVisible(!isButtonVisible)}>
                {
                    !isButtonVisible ? <FaChevronDown className="text-2xl text-white" /> : <FaChevronUp className="text-2xl text-white" />
                }
              </div>
            </div>
            <div className="absolute top-8 right-2">
              {isButtonVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link href={href} className="bg-gray-700 rounded-lg shadow-lg p-2 text-white space-x-2 flex justify-center items-center">
                            <FaExternalLinkAlt className="text-xl" />
                            <p className="text-white text-lg">{text}</p>
                        </Link>

                        
                    </motion.div>
                </>
              )}
            </div>
        </div>
    )
}

export default FloatingLink;
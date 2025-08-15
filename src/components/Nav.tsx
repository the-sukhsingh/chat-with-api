"use client"
import React from 'react'
import {motion} from 'motion/react';
import Link from 'next/link';

const Nav = () => {
    {/* Nav */ }
  return (
        < nav className ="p-2 text-center w-fit h-fit absolute top-2 left-2 " >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center justify-center space-x-2 text-gray-400 text-sm"
            >
                <span>Created by</span>
                <Link
                    href="https://x.com/thesukhjitbajwa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium underline-offset-2 hover:underline"
                >
                    Sukhjit Singh
                </Link>
                <span className="inline-flex items-center">
                    <span className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse"></span>
                        Powered by AI
                    </span>
                </span>
            </motion.div>
      </nav >
  )
}

export default Nav
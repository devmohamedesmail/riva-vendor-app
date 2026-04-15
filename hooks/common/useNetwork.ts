import { NetworkContext } from '@/context/network-provider'
import React from 'react'

export default function useNetwork() {
    const context = React.useContext(NetworkContext)
    if (!context) {
        throw new Error('useNetwork must be used within a NetworkProvider')
    }
    return context
}
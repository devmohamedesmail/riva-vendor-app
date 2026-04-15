import React from 'react'
import { Image, View ,Text} from 'react-native'
import { useSetting } from '@/hooks/common/useSetting'

export default function Logo() {
  const { settings } = useSetting()
  return (
    <View className='p-0'>
      
      {settings?.logo && (
        <Image
          source={{ uri: settings?.logo }}
          style={{ width: 90, height: 90 }}
        />
      )}
    </View>
  )
}

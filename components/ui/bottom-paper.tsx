import BottomSheet from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import React, { forwardRef, useMemo } from 'react';
import { View } from 'react-native';

type BottomPaperProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

const BottomPaper = forwardRef<BottomSheet, BottomPaperProps>(
  ({ children, snapPoints = ['40%'] }, ref) => {
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const { colorScheme } = useColorScheme();

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={memoSnapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}
      >
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </BottomSheet>
    );
  }
);

export default BottomPaper;






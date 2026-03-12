import BottomSheet from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import React, { forwardRef, useMemo } from 'react';

type BottomPaperProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

const BottomPaper = forwardRef<BottomSheet, BottomPaperProps>(
  ({ children, snapPoints = ['40%'] }, ref) => {
    const { colorScheme } = useColorScheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoSnapPoints = useMemo(() => snapPoints, [JSON.stringify(snapPoints)]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={memoSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === 'dark' ? '#555' : '#ccc',
        }}
      >
        {children}
      </BottomSheet>
    );
  }
);

export default BottomPaper;








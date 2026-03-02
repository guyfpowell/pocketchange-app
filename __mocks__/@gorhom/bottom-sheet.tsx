import React from 'react';
import { View, TextInput } from 'react-native';

const BottomSheet = React.forwardRef<unknown, { children?: React.ReactNode }>(
  ({ children }, _ref) => <View testID="bottom-sheet">{children}</View>
);
BottomSheet.displayName = 'BottomSheet';

function BottomSheetView({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

function BottomSheetBackdrop() {
  return null;
}

function BottomSheetTextInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} />;
}

function BottomSheetModalProvider({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

export default BottomSheet;
export { BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetModalProvider };

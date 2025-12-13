// import React, { useCallback } from 'react';
// import {
//   BottomSheetBackdrop,
//   BottomSheetModal,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';

// // import { styles } from './styles';
// import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { TouchableWithoutFeedback, View, Text, Pressable, StyleSheet } from 'react-native';
// import colors from '../assets/colors';
// import { MediumText } from './Typography';


// export const BottomSheet = (props) => {
//   const {
//     children,
//     refRBSheet,
//     onClose,
//     height,
//     isModal,
//     scrollEnabled,
//     disableDynamicSizing,
//     title,
//     removeSheetScrolllView=false,
//   } = props;

//   const renderBackdrop = useCallback(
//     (props) => (
//       <>
//         <BottomSheetBackdrop
//           {...props}
//           disappearsOnIndex={-1}
//           appearsOnIndex={0}
//         >
//           {isModal && (
//             <TouchableWithoutFeedback onPress={onDismiss}>
//               <View style={{ flex: 1, backgroundColor: 'transparent' }} />
//             </TouchableWithoutFeedback>
//           )}
//         </BottomSheetBackdrop>
//       </>
//     ),
//     []
//   );

//   const onDismiss = () => {
//     if (typeof onClose === 'function') {
//       onClose();
//     }
//   };

//   return (
//     <BottomSheetModal
//       ref={refRBSheet}
//       snapPoints={[height]}
//       enableDynamicSizing={disableDynamicSizing ? false : true}
//       keyboardBlurBehavior="restore"
//       enableDismissOnClose
//       backdropComponent={renderBackdrop}
//       backgroundStyle={{backgroundColor:colors.appBG}}
//       onDismiss={onDismiss}
//     >
      
//        <Pressable onPress={onClose} style={styles.header}>
//          <Text>title</Text>
      
//      </Pressable>
      
//      { removeSheetScrolllView ?
//       <View style={{ minHeight: height }}>{children}</View>
//       :
//       <BottomSheetScrollView
//       style={{paddingHorizontal:20}}
//         nestedScrollEnabled={false}
//         scrollEnabled={scrollEnabled ? true : false}>
//         <View style={{ minHeight: height }}>{children}</View>
//       </BottomSheetScrollView>
//       }
//     </BottomSheetModal>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomColor: colors.grayBorder,
//     borderBottomWidth: 1,
//     paddingBottom:hp(1),
//     marginHorizontal:20,
//   },
// })
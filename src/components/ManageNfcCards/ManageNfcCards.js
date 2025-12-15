// screens/ManageCardsScreen.js
import React,{useCallback,
  useEffect,
  useReducer,
  useRef,
  useState} from "react";
import { View, FlatList ,StyleSheet,Text,Alert} from "react-native";
import ManageCards from "../../components/ManageNfcCards/ManageCards"; // your updated component
import colors from "../../assets/colors";
import PrimaryButton from '../../../src/components/buttonComponent';
import AddNfcCard from '../../components/AddNfcCard/AddNfcCard';
 import { BottomSheet } from "../../components/bottomSheet";
 import { heightPercentageToDP } from "react-native-responsive-screen";
const DATA = [
  { id: "1", title: "Yest" },
  { id: "2", title: "JYest" },
  { id: "3", title: "My FWRD Card" },
  { id: "4", title: "My FWRD Card" },
  { id: "5", title: "My 2nd Card" },
  { id: "6", title: "My 2nd Card" },
];

const ManageNfcCards = ({title, onEdit, onDelete}) => {


const refRBSheet = useRef();
    const openBottomSheet = useCallback(
    item => {
      if (refRBSheet.current) {
        refRBSheet.current.present();
      }
    },
    [refRBSheet],
  );

  const hideBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.close();
    }
  };


  const renderItem = ({ item }) => (
    <ManageCards
      title={item.title}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  return (
    <View style={style.container}>
         <View style={style.wraper}>
            <Text style={style.titleView}>
                {title}
            </Text>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
      </View>
      <View style={style.buttonView}>
                    <PrimaryButton
                    title= {"Scan New NFC Card"}
                    onPress={openBottomSheet}
                    />
              
        </View>
<BottomSheet
        refRBSheet={refRBSheet}
        onClose={() => hideBottomSheet()}
        scrollEnabled={true}
        disableDynamicSizing={true}
        removeSheetScrolllView={true}
        height={heightPercentageToDP(80)}
      >
       
      <AddNfcCard title="Add NFC Card"/>;
      </BottomSheet>
        
    </View>
  );
};

const style = StyleSheet.create(
{
    container:{
        flex:1,
        backgroundColor:colors.bgcolor
    },
    wraper:{
        flex:1,
        //paddingHorizontal:20
    },
    titleView:{
       fontSize:22,
       fontWeight:'700',
        marginBottom: 18,
        alignSelf:'center'
    },
    
buttonView:{
     paddingBottom:50,
     paddingHorizontal:20
  }

}
);


export default ManageNfcCards;

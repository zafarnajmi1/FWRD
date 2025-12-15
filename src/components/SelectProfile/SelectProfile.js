// screens/SelectProfile.js
import React,{useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,} from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import ProfileCard from "../../components/SelectProfile/ProfileCard";
import colors from "../../assets/colors";
import AddProfile from '../../components/AddProfileComponents/AddProfile';
 import { BottomSheet } from "../../components/bottomSheet";
 import { heightPercentageToDP } from "react-native-responsive-screen";
const profiles = [
  { id: "1", name: "Gym" },
  { id: "2", name: "Strict" },
  { id: "3", name: "GymGymGym" },
  { id: "4", name: "StrictGymGym" },
];

const SelectProfile = ({ navigation , onDone}) => {

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
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Profile</Text>

        <Pressable onPress={ onDone}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProfileCard
            title={item.name}
            onEdit={openBottomSheet}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
<BottomSheet
        refRBSheet={refRBSheet}
        onClose={() => hideBottomSheet()}
        scrollEnabled={true}
        disableDynamicSizing={true}
        removeSheetScrolllView={true}
        height={heightPercentageToDP(80)}
      >
       
      <AddProfile status={"edit"} title={"Edit Profile"}/>;
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgcolor,
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
  },
  done: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

export default SelectProfile;

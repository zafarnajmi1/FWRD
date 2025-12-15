import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./analytics.styles";
import TaskDetail from "../../components/AnalyticsComponents/AnalyticsGrid";
import TaskRow from "../../components/AnalyticsRow/AnalyticsRow";
//import TaskRowArrow from "../../components/TaskRowArrow/TaskRowArrow";
import TaskRowArrow from '../../components/AnalyticsRowArrow/AnalyticsRowArrow'
const AnalyticsScreen = ({ navigation }) => {
  // Change this value to show different components: 1 = TaskDetail, 2 = TaskRow, 3 = TaskRowArrow
  const [showComponent, setShowComponent] = useState(2);
  // TaskDetail data - 3 boxes with 3 columns each (enough data to scroll)
  const taskDetailData = [
    {
      id: "1",
      date1: "Dec 6",
      hours1: "5h",
      minutes1: "30m",
      date2: "Dec 5",
      hours2: "4h",
      minutes2: "45m",
      date3: "Dec 4",
      hours3: "6h",
      minutes3: "15m",
    },
    {
      id: "2",
      date1: "Dec 3",
      hours1: "3h",
      minutes1: "20m",
      date2: "Dec 2",
      hours2: "5h",
      minutes2: "10m",
      date3: "Dec 1",
      hours3: "4h",
      minutes3: "25m",
    },
    {
      id: "3",
      date1: "Nov 30",
      hours1: "6h",
      minutes1: "15m",
      date2: "Nov 29",
      hours2: "5h",
      minutes2: "30m",
      date3: "Nov 28",
      hours3: "4h",
      minutes3: "45m",
    },
    {
      id: "4",
      date1: "Nov 27",
      hours1: "4h",
      minutes1: "40m",
      date2: "Nov 26",
      hours2: "3h",
      minutes2: "15m",
      date3: "Nov 25",
      hours3: "5h",
      minutes3: "50m",
    },
    {
      id: "5",
      date1: "Nov 24",
      hours1: "7h",
      minutes1: "20m",
      date2: "Nov 23",
      hours2: "6h",
      minutes2: "45m",
      date3: "Nov 22",
      hours3: "4h",
      minutes3: "30m",
    },
    {
      id: "6",
      date1: "Nov 21",
      hours1: "5h",
      minutes1: "10m",
      date2: "Nov 20",
      hours2: "4h",
      minutes2: "25m",
      date3: "Nov 19",
      hours3: "6h",
      minutes3: "40m",
    },
    {
      id: "7",
      date1: "Nov 18",
      hours1: "3h",
      minutes1: "55m",
      date2: "Nov 17",
      hours2: "5h",
      minutes2: "20m",
      date3: "Nov 16",
      hours3: "4h",
      minutes3: "15m",
    },
  ];

  // TaskRow data - single row with date and time (enough data to scroll)
  const taskRowData = [
    {
      id: "row1",
      date: "Dec 6",
      hours: "6h",
      minutes: "40m",
    },
    {
      id: "row2",
      date: "Dec 5",
      hours: "5h",
      minutes: "30m",
    },
    {
      id: "row3",
      date: "Dec 4",
      hours: "4h",
      minutes: "45m",
    },
    {
      id: "row4",
      date: "Dec 3",
      hours: "7h",
      minutes: "15m",
    },
    {
      id: "row5",
      date: "Dec 2",
      hours: "6h",
      minutes: "20m",
    },
    {
      id: "row6",
      date: "Dec 1",
      hours: "5h",
      minutes: "50m",
    },
    {
      id: "row7",
      date: "Nov 30",
      hours: "4h",
      minutes: "35m",
    },
    {
      id: "row8",
      date: "Nov 29",
      hours: "8h",
      minutes: "10m",
    },
    {
      id: "row9",
      date: "Nov 28",
      hours: "3h",
      minutes: "45m",
    },
    {
      id: "row10",
      date: "Nov 27",
      hours: "6h",
      minutes: "25m",
    },
  ];

  // TaskRowArrow data - row with date, hours, minutes and arrow (enough data to scroll)
  const taskRowArrowData = [
    {
      id: "arrow1",
      date: "Dec",
      hours: "6h",
      minutes: "30m",
    },
    {
      id: "arrow2",
      date: "Dec",
      hours: "5h",
      minutes: "45m",
    },
    {
      id: "arrow3",
      date: "Dec",
      hours: "4h",
      minutes: "20m",
    },
    {
      id: "arrow4",
      date: "Nov",
      hours: "7h",
      minutes: "15m",
    },
    {
      id: "arrow5",
      date: "Nov",
      hours: "6h",
      minutes: "40m",
    },
    {
      id: "arrow6",
      date: "Nov",
      hours: "5h",
      minutes: "25m",
    },
    {
      id: "arrow7",
      date: "Nov",
      hours: "8h",
      minutes: "50m",
    },
    {
      id: "arrow8",
      date: "Nov",
      hours: "4h",
      minutes: "10m",
    },
    {
      id: "arrow9",
      date: "Oct",
      hours: "6h",
      minutes: "35m",
    },
    {
      id: "arrow10",
      date: "Oct",
      hours: "5h",
      minutes: "55m",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Analytics</Text>
          <View style={styles.sectionsContainer}>
            {/* Today Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Today</Text>
              <Text style={styles.timeText}>2:45</Text>
            </View>
             <View style={styles.separator} />
            {/* Average Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Average</Text>
              <Text style={styles.timeText}>4:15</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.wrapper}>

        {/* FlatList with conditional rendering based on showComponent */}
        <View style={styles.flatListWrapper}>
        {showComponent === 1 && (
          <FlatList
            data={taskDetailData}
            renderItem={({ item }) => (
              <TaskDetail 
                item={item} 
                onPress={() => {
                  setShowComponent(2);
                }} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            style={styles.flatListStyle}
          />
        )}

        {showComponent === 2 && (
          <FlatList
            data={taskRowData}
            renderItem={({ item }) => (
              <TaskRow 
                item={item} 
                onPress={() => {
                  setShowComponent(3);
                }} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            style={styles.flatListStyle}
          />
        )}

        {showComponent === 3 && (
          <FlatList
            data={taskRowArrowData}
            renderItem={({ item }) => (
              <TaskRowArrow 
                item={item} 
                onPress={() => {
                  setShowComponent(1);
                }} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            style={styles.flatListStyle}
          />
        )}
        </View>
      </View>
    </View>
  );
};

export default AnalyticsScreen;
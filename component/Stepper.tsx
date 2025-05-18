import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

interface StepperProps {
  step: 1 | 2 | 3;
}

const Stepper: React.FC<StepperProps> = ({ step }) => {
  return (
    <View style={styles.stepperContainer}>
      {/* Step 1: Check out */}
      <View style={styles.stepItem}>
        <View style={[styles.circle, { backgroundColor: step === 1 ? '#222' : '#C4C4C4' }]}> 
          <FontAwesome6 name="location-dot" size={18} color="#fff" />
        </View>
        <Text style={[styles.stepLabel, step === 1 && styles.activeLabel]}>Check out</Text>
      </View>
      <View style={styles.dottedLine} />
      {/* Step 2: Payment */}
      <View style={styles.stepItem}>
        <View style={[styles.circle, { backgroundColor: step === 2 ? '#222' : '#C4C4C4' }]}> 
          <FontAwesome6 name="credit-card" size={18} color="#fff" />
        </View>
        <Text style={[styles.stepLabel, step === 2 && styles.activeLabel]}>Payment</Text>
      </View>
      <View style={styles.dottedLine} />
      {/* Step 3: Success */}
      <View style={styles.stepItem}>
        <View style={[styles.circle, { backgroundColor: step === 3 ? '#222' : '#C4C4C4' }]}> 
          <FontAwesome6 name="check" size={18} color="#fff" />
        </View>
        <Text style={[styles.stepLabel, step === 3 && styles.activeLabel]}>Success</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  stepItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dottedLine: {
    width: 60,
    height: 2,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#C4C4C4',
    marginHorizontal: 2,
  },
  stepLabel: {
    fontSize: 12,
    color: '#C4C4C4',
    marginTop: 4,
  },
  activeLabel: {
    color: '#222',
    fontWeight: 'bold',
  },
});

export default Stepper;

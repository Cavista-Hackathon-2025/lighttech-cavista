import React from 'react';
import { Text, View } from 'react-native';

const MedifyLogo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Med</Text>
      <View style={styles.iContainer}>
        <Text style={styles.text}>i</Text>
        <View style={styles.dot} />
      </View>
      <Text style={styles.text}>fy</Text>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  iContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 9,
    width: 8,
    height: 8,
    backgroundColor: '#00E676',
    borderRadius: 4,
  }
};

export default MedifyLogo;
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const FadeAndSlideItem = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(80);

  const startAnimation = (duration) => {
    // Resetear valores inmediatamente
    opacity.value = 0;
    translateY.value = 80;
    
    // Ejecutar con retraso mínimo para permitir que el reset se renderice
    setTimeout(() => {
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.exp) });
    }, 50);
  };

  useEffect(() => {
    startAnimation(1000); // Velocidad inicial
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardText}>1. Animacion de Entrada</Text>
      <Text style={styles.cardSubText}>Aparece desde abajo con opacidad graduada al cargar.</Text>
      
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Pressable onPress={() => startAnimation(300)} style={styles.speedButton}>
          <Text style={styles.speedButtonText}>Rápido</Text>
        </Pressable>
        <Pressable onPress={() => startAnimation(1000)} style={styles.speedButton}>
          <Text style={styles.speedButtonText}>Medio</Text>
        </Pressable>
        <Pressable onPress={() => startAnimation(3000)} style={styles.speedButton}>
          <Text style={styles.speedButtonText}>Lento</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const AnimatedButton = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <View style={styles.section}>
      <Text style={styles.label}>2. Botón interactivo (Spring)</Text>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.9, { damping: 10, stiffness: 300 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 300 }); }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Presioname</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const DraggableSquare = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const shadowValue = useSharedValue(3);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Extra: Cambiar la sombra al iniciar la animación/gesto
      shadowValue.value = withTiming(15, { duration: 200 });
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      shadowValue.value = withTiming(3, { duration: 200 });
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      elevation: shadowValue.value,
      shadowOffset: { width: 0, height: shadowValue.value },
      shadowRadius: shadowValue.value,
      shadowOpacity: shadowValue.value / 40,
    };
  });

  return (
    <View style={[styles.section, { zIndex: 10 }]}>
      <Text style={styles.label}>3. Cuadrado Arrastrable (Gestos)</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.square, animatedStyle]} />
      </GestureDetector>
    </View>
  );
};

const LoadingBar = () => {
  const widthPercentage = useSharedValue(0);

  useEffect(() => {
    widthPercentage.value = withRepeat(
      withTiming(100, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthPercentage.value}%`
    };
  });

  return (
    <View style={styles.section}>
      <Text style={styles.label}>4. Barra de Progreso Dinámica</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, animatedStyle]} />
      </View>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.main}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Taller Animaciones</Text>
        <Text style={styles.headerSubtitle}>React Native Reanimated</Text>

        <FadeAndSlideItem />
        
        <View style={styles.divider} />
        <AnimatedButton />
        
        <View style={styles.divider} />
        <DraggableSquare />
        
        <View style={styles.divider} />
        <LoadingBar />

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 24,
  },
  section: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardSubText: {
    fontSize: 14,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    shadowColor: '#000',
  },
  track: {
    height: 12,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  speedButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  }
});

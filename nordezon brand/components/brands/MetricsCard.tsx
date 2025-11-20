import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CText from '../common/CText';

interface Metric {
  label: string;
  value: number;
  color?: string;
}

interface MetricsCardProps {
  title: string;
  subtitle?: string;
  metrics: Metric[];
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, subtitle, metrics }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <CText style={styles.title}>{title}</CText>
          {subtitle && <CText style={styles.subtitle}>{subtitle}</CText>}
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricBox}>
            <CText style={[styles.value, { color: metric.color || primaryOrange }]}>{metric.value}</CText>
            <CText style={styles.label}>{metric.label}</CText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)', // subtle border for shadow effect
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricBox: {
    width: '48%',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#fafafa',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MetricsCard;

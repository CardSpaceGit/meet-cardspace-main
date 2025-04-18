import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Theme } from '@/constants/Theme';

export default function CardDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>CardSpace Cards</Text>

        {/* Basic Card */}
        <Card
          title="Basic Card"
          subtitle="This is a simple card with title and subtitle"
        >
          <Text style={styles.cardContent}>
            This is the content of the card. You can put any components here.
          </Text>
        </Card>

        {/* Card with Actions */}
        <Card
          title="Card with Actions"
          subtitle="This card has primary and secondary actions"
          primaryAction={{
            title: "Continue",
            onPress: () => console.log("Primary action pressed")
          }}
          secondaryAction={{
            title: "Cancel",
            onPress: () => console.log("Secondary action pressed")
          }}
        >
          <Text style={styles.cardContent}>
            This card demonstrates how to add action buttons to a card.
          </Text>
        </Card>

        {/* Card with Footer */}
        <Card
          title="Card with Footer"
          footer={
            <Text style={styles.footerText}>
              This is a custom footer section
            </Text>
          }
        >
          <Text style={styles.cardContent}>
            This card has a footer section that can contain any component.
          </Text>
        </Card>

        {/* Card with All Features */}
        <Card
          title="Complete Card Example"
          subtitle="Using all available features"
          primaryAction={{
            title: "Submit",
            variant: "primary",
            onPress: () => console.log("Submit pressed")
          }}
          secondaryAction={{
            title: "Cancel",
            variant: "outline",
            onPress: () => console.log("Cancel pressed")
          }}
          footer={
            <Text style={styles.footerText}>
              Created at: {new Date().toLocaleString()}
            </Text>
          }
        >
          <View style={styles.complexContent}>
            <Text style={styles.cardContent}>
              This card demonstrates the complete set of features available in our Card component.
            </Text>
            <Text style={styles.cardContent}>
              All primary buttons use the CardSpace gradient by default.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.style_04,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.md,
  },
  title: {
    ...Theme.text.header,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  cardContent: {
    ...Theme.text.body,
    marginBottom: Theme.spacing.md,
  },
  complexContent: {
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.style_07,
    paddingLeft: Theme.spacing.md,
  },
  footerText: {
    ...Theme.text.caption,
    color: Theme.colors.textSecondary,
  },
}); 
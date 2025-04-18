import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Button, ButtonProps } from './Button';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  footerStyle?: ViewStyle;
  primaryAction?: Omit<ButtonProps, 'fullWidth'>;
  secondaryAction?: Omit<ButtonProps, 'fullWidth'>;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  footerStyle,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Card Header */}
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        </View>
      )}

      {/* Card Content */}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>

      {/* Card Actions */}
      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {secondaryAction && (
            <View style={styles.actionButton}>
              <Button 
                {...secondaryAction} 
                variant={secondaryAction.variant || 'outline'} 
                fullWidth={true} 
              />
            </View>
          )}
          
          {primaryAction && (
            <View style={styles.actionButton}>
              <Button 
                {...primaryAction} 
                variant={primaryAction.variant || 'primary'} 
                fullWidth={true} 
              />
            </View>
          )}
        </View>
      )}

      {/* Card Footer */}
      {footer && (
        <View style={[styles.footer, footerStyle]}>
          {footer}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    marginVertical: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  header: {
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.style_04,
  },
  title: {
    ...Theme.text.header,
    fontSize: Theme.text.subheader.fontSize,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.text.subheader,
    color: Theme.colors.textSecondary,
  },
  content: {
    padding: Theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.style_04,
  },
  actionButton: {
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  footer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.style_04,
  },
}); 
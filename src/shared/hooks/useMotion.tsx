import React, { type FC, type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from './useIsMobile';

type AnyProps = Record<string, unknown>;

function withoutAnimationProps(props: AnyProps): AnyProps {
  const animKeys = ['initial', 'animate', 'whileInView', 'viewport', 'transition', 'whileHover', 'exit', 'layout', 'variants', 'onAnimationComplete'];
  const rest: AnyProps = {};
  for (const key of Object.keys(props)) {
    if (!animKeys.includes(key)) {
      rest[key] = props[key];
    }
  }
  return rest;
}

export const MotionDiv: FC<PropsWithChildren<AnyProps>> = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement('div', withoutAnimationProps(props), children);
  }
  return React.createElement(motion.div, props, children);
};

export const MotionH1: FC<PropsWithChildren<AnyProps>> = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement('h1', withoutAnimationProps(props), children);
  }
  return React.createElement(motion.h1, props, children);
};

export const MotionP: FC<PropsWithChildren<AnyProps>> = ({ children, ...props }) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return React.createElement('p', withoutAnimationProps(props), children);
  }
  return React.createElement(motion.p, props, children);
};

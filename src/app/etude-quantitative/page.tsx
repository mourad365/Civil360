/**
 * Page Next.js - Module d'Étude Quantitative
 * Route: /etude-quantitative
 */

'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EtudeQuantitative from '@/modules/etude-quantitative/EtudeQuantitative';
import '@/modules/etude-quantitative/styles/etude.css';

export default function EtudeQuantitativePage() {
  return (
    <DashboardLayout title="Étude Quantitative">
      <EtudeQuantitative />
    </DashboardLayout>
  );
}

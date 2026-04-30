"use client";

import React from 'react';
import { LandingLayout } from "../../components/Layouts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}

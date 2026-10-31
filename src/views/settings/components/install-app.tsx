"use client"

import { Check, Download } from "lucide-react"

import { showInstallGuide, useInstallPrompt } from "@/components/pwa"

import { SettingsActionRow, SettingsGroup, SettingsRow } from "./settings-ui"

/**
 * The Settings > General "App" group. Always visible: an install entry
 * point that opens the guide dialog, or an "already installed"
 * confirmation when the app runs as an installed app.
 */
export function InstallAppGroup() {
  const { installed } = useInstallPrompt()

  return (
    <SettingsGroup title="App">
      {installed ? (
        <SettingsRow label="Install app" description="Already installed">
          <Check className="size-5 text-primary" aria-label="Installed" />
        </SettingsRow>
      ) : (
        <SettingsActionRow
          icon={<Download className="size-5" aria-hidden="true" />}
          label="Install app"
          description="Add Track Taka to your home screen"
          onClick={() => void showInstallGuide()}
          chevron={false}
        />
      )}
    </SettingsGroup>
  )
}

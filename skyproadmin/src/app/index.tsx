import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase, SiteSettings } from '../supabase'

export default function AdminScreen() {
  const [whatsappNumber, setWhatsappNumber] = useState('123456789')
  const [whatsappMsg, setWhatsappMsg] = useState('')
  const [instagramName, setInstagramName] = useState('lionexch99')
  const [footerDomain, setFooterDomain] = useState('www.skyexchangepro.com')
  const [support1, setSupport1] = useState('+351926917651')
  const [support2, setSupport2] = useState('+351926917279')

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setFetching(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'config')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error)
      }

      if (data) {
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number)
        if (data.instagram_name) setInstagramName(data.instagram_name)
        if (data.footer_domain) setFooterDomain(data.footer_domain)
        if (data.support_number_1) setSupport1(data.support_number_1)
        if (data.support_number_2) setSupport2(data.support_number_2)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setStatusMessage('')

    const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '')
    const cleanWaUrl = `https://api.whatsapp.com/send/?phone=${cleanWaNumber}&text=${encodeURIComponent(
      whatsappMsg
    )}&type=phone_number&app_absent=0`
    const cleanIgUrl = `https://www.instagram.com/${instagramName.replace('@', '')}`

    const payload: SiteSettings = {
      id: 'config',
      whatsapp_number: cleanWaNumber,
      whatsapp_url: cleanWaUrl,
      instagram_name: instagramName.replace('@', ''),
      instagram_url: cleanIgUrl,
      footer_domain: footerDomain,
      support_number_1: support1,
      support_number_2: support2,
      updated_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase.from('site_settings').upsert(payload)

      if (error) {
        console.error('Save error:', error)
        if (Platform.OS === 'web') {
          alert('Error saving settings: ' + error.message)
        } else {
          Alert.alert('Error', error.message)
        }
      } else {
        setStatusMessage('✅ Settings saved! SkyPro portal updated live.')
        if (Platform.OS === 'web') {
          alert('✅ Success: Settings updated live in database!')
        } else {
          Alert.alert('Success', 'Settings updated live!')
        }
      }
    } catch (err: any) {
      console.error(err)
      if (Platform.OS === 'web') {
        alert('Error: ' + err.message)
      } else {
        Alert.alert('Error', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const testWhatsApp = () => {
    const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '')
    const url = `https://api.whatsapp.com/send/?phone=${cleanWaNumber}&text=${encodeURIComponent(
      whatsappMsg
    )}&type=phone_number&app_absent=0`
    Linking.openURL(url)
  }

  const testInstagram = () => {
    const url = `https://www.instagram.com/${instagramName.replace('@', '')}`
    Linking.openURL(url)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={styles.statusDot} />
            <Text style={styles.badgeText}>Live Supabase Sync</Text>
          </View>
          <Text style={styles.title}>SkyPro Control Hub</Text>
          <Text style={styles.subtitle}>
            Directly update WhatsApp, Instagram & Branding on your Live Exchange.
          </Text>
        </View>

        {fetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>Fetching active settings from Supabase...</Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            {/* WhatsApp Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💬</Text>
              <Text style={styles.sectionTitle}>WhatsApp & Sign Up Contact</Text>
            </View>

            <Text style={styles.label}>WhatsApp Number (With Country Code)</Text>
            <TextInput
              style={styles.input}
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              placeholder="e.g. 919876543210"
              placeholderTextColor="#64748b"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Custom Greeting Text (Optional)</Text>
            <TextInput
              style={styles.input}
              value={whatsappMsg}
              onChangeText={setWhatsappMsg}
              placeholder="e.g. Hi, I want to create a new betting ID"
              placeholderTextColor="#64748b"
            />

            <TouchableOpacity style={styles.testBtn} onPress={testWhatsApp}>
              <Text style={styles.testBtnText}>📱 Test WhatsApp Link</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Instagram Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📸</Text>
              <Text style={styles.sectionTitle}>Instagram Branding</Text>
            </View>

            <Text style={styles.label}>Instagram Username / Handle</Text>
            <TextInput
              style={styles.input}
              value={instagramName}
              onChangeText={setInstagramName}
              placeholder="e.g. lionexch99"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.testBtn} onPress={testInstagram}>
              <Text style={styles.testBtnText}>📸 Test Instagram Page</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Footer Branding & Domain */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌐</Text>
              <Text style={styles.sectionTitle}>Footer & Domain Branding</Text>
            </View>

            <Text style={styles.label}>Display Domain (Footer Disclaimer)</Text>
            <TextInput
              style={styles.input}
              value={footerDomain}
              onChangeText={setFooterDomain}
              placeholder="e.g. www.skyexchangepro.com"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Support Helpline 1</Text>
            <TextInput
              style={styles.input}
              value={support1}
              onChangeText={setSupport1}
              placeholder="e.g. +351926917651"
              placeholderTextColor="#64748b"
            />

            <Text style={styles.label}>Support Helpline 2</Text>
            <TextInput
              style={styles.input}
              value={support2}
              onChangeText={setSupport2}
              placeholder="e.g. +351926917279"
              placeholderTextColor="#64748b"
            />

            {statusMessage ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{statusMessage}</Text>
              </View>
            ) : null}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveButtonText}>💾 Save & Update Live Exchange</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  badgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 16,
  },
  testBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 20,
  },
  testBtnText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 20,
  },
  successBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 16,
    fontSize: 14,
  },
})

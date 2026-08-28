import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase, SiteSettings } from '../supabase';

export default function AdminScreen() {
  const [whatsappNumber, setWhatsappNumber] = useState('123456789');
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [instagramName, setInstagramName] = useState('lionexch99');
  const [footerDomain, setFooterDomain] = useState('www.skyexchangepro.com');
  const [support1, setSupport1] = useState('+351926917651');
  const [support2, setSupport2] = useState('+351926917279');
  const [banner1, setBanner1] = useState('/banner.jpeg');
  const [banner2, setBanner2] = useState('/images.jpeg');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'config')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
      }

      if (data) {
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
        if (data.instagram_name) setInstagramName(data.instagram_name);
        if (data.footer_domain) setFooterDomain(data.footer_domain);
        if (data.support_number_1) setSupport1(data.support_number_1);
        if (data.support_number_2) setSupport2(data.support_number_2);
        if (data.banner_1_url) setBanner1(data.banner_1_url);
        if (data.banner_2_url) setBanner2(data.banner_2_url);
        if (data.updated_at) {
          const date = new Date(data.updated_at);
          setLastSavedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const getCleanWaNumber = () => whatsappNumber.replace(/[^0-9]/g, '');
  const getGeneratedWaUrl = () => {
    const num = getCleanWaNumber();
    return `https://api.whatsapp.com/send/?phone=${num}&text=${encodeURIComponent(
      whatsappMsg
    )}&type=phone_number&app_absent=0`;
  };

  const getGeneratedIgUrl = () => `https://www.instagram.com/${instagramName.replace('@', '').trim()}`;

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2200);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMessage(null);

    const cleanWaNumber = getCleanWaNumber();
    const cleanWaUrl = getGeneratedWaUrl();
    const cleanIg = instagramName.replace('@', '').trim();
    const cleanIgUrl = `https://www.instagram.com/${cleanIg}`;
    const nowIso = new Date().toISOString();

    const payload: SiteSettings = {
      id: 'config',
      whatsapp_number: cleanWaNumber,
      whatsapp_url: cleanWaUrl,
      instagram_name: cleanIg,
      instagram_url: cleanIgUrl,
      footer_domain: footerDomain.trim(),
      support_number_1: support1.trim(),
      support_number_2: support2.trim(),
      banner_1_url: banner1.trim() || '/banner.jpeg',
      banner_2_url: banner2.trim() || '/images.jpeg',
      updated_at: nowIso,
    };

    try {
      const { error } = await supabase.from('site_settings').upsert(payload);

      if (error) {
        console.error('Save error:', error);
        setStatusMessage({ type: 'error', text: `Sync Failed: ${error.message}` });
        if (Platform.OS !== 'web') {
          Alert.alert('Database Sync Error', error.message);
        }
      } else {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
        setStatusMessage({
          type: 'success',
          text: 'Configuration successfully synced to Live SkyPro Portal!',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: `Error: ${err.message || 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Could not open link:', err));
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Fixed Header */}
      <View style={styles.topNav}>
        <View style={styles.navBrand}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.navTitle}>SKYPRO</Text>
            <Text style={styles.navSubtitle}>EXECUTIVE CONTROL</Text>
          </View>
        </View>

        <View style={styles.navRight}>
          <View style={styles.syncStatusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.syncStatusText}>Live Supabase</Text>
          </View>

          <TouchableOpacity
            style={styles.navActionBtn}
            onPress={fetchSettings}
            disabled={fetching}
            activeOpacity={0.7}
          >
            <Ionicons
              name="refresh"
              size={16}
              color={fetching ? '#64748b' : '#94a3b8'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollWrapper}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Title */}
        <View style={styles.bannerSection}>
          <View style={styles.taglinePill}>
            <Ionicons name="flash" size={12} color="#F59E0B" />
            <Text style={styles.taglineText}>REAL-TIME CONFIGURATION GATEWAY</Text>
          </View>
          <Text style={styles.mainHeading}>Site Management & Direct Routing</Text>
          <Text style={styles.mainDescription}>
            Manage player onboarding channels, direct WhatsApp sign-up links, Instagram handles, and 24/7 helplines with instant live reflection.
          </Text>
          {lastSavedTime && (
            <View style={styles.lastSavedBadge}>
              <Ionicons name="time-outline" size={13} color="#94A3B8" />
              <Text style={styles.lastSavedText}>Last synchronized at {lastSavedTime}</Text>
            </View>
          )}
        </View>

        {fetching ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingHeading}>Connecting to Supabase Database</Text>
            <Text style={styles.loadingSub}>Pulling live exchange variables...</Text>
          </View>
        ) : (
          <View style={styles.contentGrid}>
            {/* Status Alert Message */}
            {statusMessage && (
              <View
                style={[
                  styles.notificationBanner,
                  statusMessage.type === 'success'
                    ? styles.notificationSuccess
                    : styles.notificationError,
                ]}
              >
                <Ionicons
                  name={statusMessage.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                  size={20}
                  color={statusMessage.type === 'success' ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.notificationText,
                    statusMessage.type === 'success'
                      ? styles.notificationSuccessText
                      : styles.notificationErrorText,
                  ]}
                >
                  {statusMessage.text}
                </Text>
              </View>
            )}

            {/* CARD 1: WHATSAPP SIGN-UP & ONBOARDING */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(37, 211, 102, 0.12)' }]}>
                  <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>WhatsApp Direct Gateway</Text>
                  <Text style={styles.cardSubtitle}>Primary onboarding & VIP sign-up funnel</Text>
                </View>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>CORE ROUTE</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* WhatsApp Phone Number */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>WHATSAPP PHONE NUMBER</Text>
                    <Text style={styles.inputHelper}>Country Code Included</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call" size={16} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={whatsappNumber}
                      onChangeText={setWhatsappNumber}
                      placeholder="e.g. 919876543210"
                      placeholderTextColor="#475569"
                      keyboardType="phone-pad"
                    />
                  </View>
                  <Text style={styles.fieldNote}>
                    Numbers only (e.g., 91 for India, 351 for Portugal). No symbols or spaces.
                  </Text>
                </View>

                {/* Custom Greeting */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>AUTO-FILLED WELCOME MESSAGE</Text>
                    <Text style={styles.inputHelper}>Optional</Text>
                  </View>
                  <View style={[styles.inputContainer, styles.textAreaContainer]}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={16}
                      color="#64748B"
                      style={[styles.inputIcon, { marginTop: 12 }]}
                    />
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={whatsappMsg}
                      onChangeText={setWhatsappMsg}
                      placeholder="e.g. Hello, I want to create a new SkyPro Betting ID"
                      placeholderTextColor="#475569"
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  {/* Preset Template Chips */}
                  <View style={styles.chipRow}>
                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setWhatsappMsg('Hello, I want to create a new betting ID')}
                    >
                      <Ionicons name="add-circle-outline" size={13} color="#F59E0B" />
                      <Text style={styles.templateChipText}>New ID Signup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setWhatsappMsg('Hello, I need assistance with deposit & withdrawal')}
                    >
                      <Ionicons name="add-circle-outline" size={13} color="#F59E0B" />
                      <Text style={styles.templateChipText}>Deposit Help</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setWhatsappMsg('Hello SkyPro Team, I want to get VIP access')}
                    >
                      <Ionicons name="add-circle-outline" size={13} color="#F59E0B" />
                      <Text style={styles.templateChipText}>VIP Access</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Generated URL Box */}
                <View style={styles.generatedUrlBox}>
                  <View style={styles.urlHeaderRow}>
                    <Text style={styles.urlBoxLabel}>GENERATED WHATSAPP URL</Text>
                    <TouchableOpacity
                      style={styles.copyBtn}
                      onPress={() => copyToClipboard(getGeneratedWaUrl(), 'whatsapp')}
                    >
                      <Ionicons
                        name={copiedField === 'whatsapp' ? 'checkmark' : 'copy-outline'}
                        size={13}
                        color={copiedField === 'whatsapp' ? '#10B981' : '#94A3B8'}
                      />
                      <Text
                        style={[
                          styles.copyBtnText,
                          copiedField === 'whatsapp' && { color: '#10B981' },
                        ]}
                      >
                        {copiedField === 'whatsapp' ? 'Copied' : 'Copy'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.urlBoxContent} numberOfLines={1}>
                    {getGeneratedWaUrl()}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.testActionBtn}
                    onPress={() => openUrl(getGeneratedWaUrl())}
                  >
                    <Ionicons name="open-outline" size={16} color="#25D366" />
                    <Text style={[styles.testActionBtnText, { color: '#25D366' }]}>
                      Test WhatsApp Channel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* CARD 2: INSTAGRAM & SOCIAL BRANDING */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(225, 48, 108, 0.12)' }]}>
                  <Ionicons name="logo-instagram" size={22} color="#E1306C" />
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>Official Instagram Handle</Text>
                  <Text style={styles.cardSubtitle}>Direct social branding link on site header & footer</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>INSTAGRAM USERNAME / HANDLE</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.atPrefix}>@</Text>
                    <TextInput
                      style={styles.textInput}
                      value={instagramName}
                      onChangeText={setInstagramName}
                      placeholder="e.g. lionexch99"
                      placeholderTextColor="#475569"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Generated URL Box */}
                <View style={styles.generatedUrlBox}>
                  <View style={styles.urlHeaderRow}>
                    <Text style={styles.urlBoxLabel}>GENERATED PROFILE LINK</Text>
                    <TouchableOpacity
                      style={styles.copyBtn}
                      onPress={() => copyToClipboard(getGeneratedIgUrl(), 'instagram')}
                    >
                      <Ionicons
                        name={copiedField === 'instagram' ? 'checkmark' : 'copy-outline'}
                        size={13}
                        color={copiedField === 'instagram' ? '#10B981' : '#94A3B8'}
                      />
                      <Text
                        style={[
                          styles.copyBtnText,
                          copiedField === 'instagram' && { color: '#10B981' },
                        ]}
                      >
                        {copiedField === 'instagram' ? 'Copied' : 'Copy'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.urlBoxContent} numberOfLines={1}>
                    {getGeneratedIgUrl()}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.testActionBtn}
                    onPress={() => openUrl(getGeneratedIgUrl())}
                  >
                    <Ionicons name="open-outline" size={16} color="#E1306C" />
                    <Text style={[styles.testActionBtnText, { color: '#E1306C' }]}>
                      Verify Instagram Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* CARD 3: DOMAIN BRANDING & 24/7 HELPLINES */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
                  <Ionicons name="globe-outline" size={22} color="#38BDF8" />
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>Domain & 24/7 Helplines</Text>
                  <Text style={styles.cardSubtitle}>Exchange copyright domain and support contacts</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* Domain Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>DISPLAY DOMAIN (FOOTER DISCLAIMER)</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons name="globe" size={16} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={footerDomain}
                      onChangeText={setFooterDomain}
                      placeholder="e.g. www.skyexchangepro.com"
                      placeholderTextColor="#475569"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.twoColumnGrid}>
                  {/* Helpline 1 */}
                  <View style={[styles.inputGroup, styles.flexColumn]}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>24/7 HELPLINE 1</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <Ionicons name="headset" size={16} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        value={support1}
                        onChangeText={setSupport1}
                        placeholder="e.g. +351926917651"
                        placeholderTextColor="#475569"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.miniDialBtn}
                      onPress={() => openUrl(`tel:${support1}`)}
                    >
                      <Ionicons name="call-outline" size={12} color="#38BDF8" />
                      <Text style={styles.miniDialText}>Test Dial</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Helpline 2 */}
                  <View style={[styles.inputGroup, styles.flexColumn]}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>24/7 HELPLINE 2</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <Ionicons name="headset" size={16} color="#64748B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        value={support2}
                        onChangeText={setSupport2}
                        placeholder="e.g. +351926917279"
                        placeholderTextColor="#475569"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.miniDialBtn}
                      onPress={() => openUrl(`tel:${support2}`)}
                    >
                      <Ionicons name="call-outline" size={12} color="#38BDF8" />
                      <Text style={styles.miniDialText}>Test Dial</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* CARD 4: PROMO BANNERS MANAGEMENT (2 BANNERS) */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
                  <Ionicons name="images-outline" size={22} color="#A855F7" />
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>Top Promo Banners (Only 2)</Text>
                  <Text style={styles.cardSubtitle}>Configure & switch home screen slider banners</Text>
                </View>
                <View style={[styles.priorityBadge, { borderColor: 'rgba(168, 85, 247, 0.3)', backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Text style={[styles.priorityText, { color: '#A855F7' }]}>2 SLIDES</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* Banner 1 */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>BANNER 1 (PRIMARY SLIDE)</Text>
                    <Text style={styles.inputHelper}>URL / Image Path</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons name="image" size={16} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={banner1}
                      onChangeText={setBanner1}
                      placeholder="/banner.jpeg or https://..."
                      placeholderTextColor="#475569"
                    />
                  </View>

                  {/* Preset Chips for Banner 1 */}
                  <View style={styles.chipRow}>
                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setBanner1('/banner.jpeg')}
                    >
                      <Ionicons name="sparkles-outline" size={13} color="#A855F7" />
                      <Text style={styles.templateChipText}>Preset: banner.jpeg</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setBanner1('/images.jpeg')}
                    >
                      <Ionicons name="sparkles-outline" size={13} color="#A855F7" />
                      <Text style={styles.templateChipText}>Preset: images.jpeg</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Banner 2 */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>BANNER 2 (SECONDARY SLIDE)</Text>
                    <Text style={styles.inputHelper}>URL / Image Path</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons name="image" size={16} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={banner2}
                      onChangeText={setBanner2}
                      placeholder="/images.jpeg or https://..."
                      placeholderTextColor="#475569"
                    />
                  </View>

                  {/* Preset Chips for Banner 2 */}
                  <View style={styles.chipRow}>
                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setBanner2('/images.jpeg')}
                    >
                      <Ionicons name="sparkles-outline" size={13} color="#A855F7" />
                      <Text style={styles.templateChipText}>Preset: images.jpeg</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.templateChip}
                      onPress={() => setBanner2('/banner.jpeg')}
                    >
                      <Ionicons name="sparkles-outline" size={13} color="#A855F7" />
                      <Text style={styles.templateChipText}>Preset: banner.jpeg</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* CARD 5: LIVE PREVIEW SIMULATOR */}
            <View style={[styles.card, styles.previewCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                  <Ionicons name="phone-portrait-outline" size={22} color="#F59E0B" />
                </View>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>Live Exchange Preview</Text>
                  <Text style={styles.cardSubtitle}>Real-time simulation of user-facing components</Text>
                </View>
              </View>

              <View style={styles.simulatorContainer}>
                <View style={styles.simHeader}>
                  <View style={styles.simDot} />
                  <View style={[styles.simDot, { backgroundColor: '#F59E0B' }]} />
                  <View style={[styles.simDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.simDomainText}>{footerDomain || 'www.skyexchangepro.com'}</Text>
                </View>

                <View style={styles.simBody}>
                  {/* Simulated WhatsApp CTA */}
                  <View style={styles.simButton}>
                    <Ionicons name="logo-whatsapp" size={18} color="#0F172A" />
                    <Text style={styles.simButtonText}>
                      WhatsApp Sign Up: {whatsappNumber || 'Not Configured'}
                    </Text>
                  </View>

                  {/* Simulated Instagram Link */}
                  <View style={styles.simSocialRow}>
                    <Ionicons name="logo-instagram" size={16} color="#E1306C" />
                    <Text style={styles.simSocialText}>@{instagramName.replace('@', '') || 'account'}</Text>
                  </View>

                  {/* Simulated Helpline strip */}
                  <View style={styles.simHelplines}>
                    <Text style={styles.simHelplineText}>
                      Support: {support1 || 'N/A'} | {support2 || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* MASTER SAVE ACTION BAR */}
            <View style={styles.saveContainer}>
              <TouchableOpacity
                style={[styles.masterSaveBtn, loading && styles.masterSaveBtnDisabled]}
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <View style={styles.savingState}>
                    <ActivityIndicator size="small" color="#0B0F19" />
                    <Text style={styles.masterSaveBtnText}>Synchronizing Live Database...</Text>
                  </View>
                ) : (
                  <View style={styles.saveBtnContent}>
                    <Ionicons name="cloud-upload-outline" size={20} color="#0B0F19" />
                    <Text style={styles.masterSaveBtnText}>Publish Live Changes to SkyPro</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#07090e',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#0c101a',
    borderBottomWidth: 1,
    borderBottomColor: '#172033',
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 1.2,
  },
  navSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 1.5,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  syncStatusText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  navActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    maxWidth: 780,
    width: '100%',
    alignSelf: 'center',
  },
  bannerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  taglineText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  mainDescription: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 580,
  },
  lastSavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#101624',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  lastSavedText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  loadingCard: {
    backgroundColor: '#0f1422',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  loadingHeading: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
  loadingSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  contentGrid: {
    gap: 20,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  notificationError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  notificationText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  notificationSuccessText: {
    color: '#34D399',
  },
  notificationErrorText: {
    color: '#F87171',
  },
  card: {
    backgroundColor: '#0e1320',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#192236',
    overflow: 'hidden',
  },
  previewCard: {
    borderColor: '#243048',
    backgroundColor: '#0c101c',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#172033',
    gap: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  priorityBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  priorityText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    letterSpacing: 0.6,
  },
  inputHelper: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080b12',
    borderWidth: 1,
    borderColor: '#202b40',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 10,
  },
  atPrefix: {
    color: '#E1306C',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 12,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 52,
    paddingTop: 10,
    paddingBottom: 10,
  },
  fieldNote: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#121928',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  templateChipText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  generatedUrlBox: {
    backgroundColor: '#06080e',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1b2438',
    gap: 6,
  },
  urlHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urlBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#121826',
    borderRadius: 4,
  },
  copyBtnText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  urlBoxContent: {
    fontSize: 12,
    color: '#38BDF8',
    fontFamily: Platform.OS === 'web' ? 'var(--font-mono)' : 'monospace',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  testActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111726',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2a40',
  },
  testActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  flexColumn: {
    flex: 1,
  },
  miniDialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  miniDialText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  simulatorContainer: {
    padding: 18,
    gap: 14,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#06080d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#192236',
  },
  simDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  simDomainText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  simBody: {
    backgroundColor: '#0a0e18',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#172033',
    gap: 12,
  },
  simButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  simButtonText: {
    color: '#07090e',
    fontSize: 13,
    fontWeight: '800',
  },
  simSocialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  simSocialText: {
    color: '#E1306C',
    fontSize: 13,
    fontWeight: '700',
  },
  simHelplines: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#172033',
  },
  simHelplineText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  saveContainer: {
    marginTop: 8,
    marginBottom: 30,
  },
  masterSaveBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  masterSaveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  masterSaveBtnText: {
    color: '#07090e',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

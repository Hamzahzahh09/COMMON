<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import { registerAccount, loginAccount } from '$lib/stores/auth';
  import { toast } from '$lib/stores/toast';
  import {
    Mail,
    Lock,
    User,
    ArrowRight,
    HeartHandshake,
    Home,
    Eye,
    EyeOff,
    Loader2,
  } from 'lucide-svelte';

  // Mode: 'signin' | 'signup'
  let activeMode: 'signin' | 'signup' = 'signin';

  // Form Fields
  let email = '';
  let password = '';
  let fullName = '';
  let confirmPassword = '';
  let rememberMe = true;

  // Password visibility states
  let showPassword = false;
  let showConfirmPassword = false;

  // Loading states
  let loading = false;
  let oauthLoading = false;

  function switchMode(mode: 'signin' | 'signup') {
    activeMode = mode;
    password = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
  }

  async function handleGoogleAuth() {
    oauthLoading = true;
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/discover`
        : '/discover';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      toast.info('Google Sign-In memerlukan konfigurasi OAuth aktif di server. Silakan masuk atau daftar menggunakan email.');
    } finally {
      oauthLoading = false;
    }
  }

  async function handleSignIn(e: Event) {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error('Silakan masukkan email address dan password Anda.');
      return;
    }

    loading = true;
    try {
      const res = await loginAccount({
        email: cleanEmail,
        password,
      });

      if (!res.success) {
        toast.error(res.message || 'Email atau password salah.');
        return;
      }

      toast.success(`Berhasil masuk ke COMMON! Selamat datang, ${res.user?.name || 'Warga'}.`);
      goto('/discover');
    } catch (err: any) {
      toast.error('Terjadi kendala saat masuk. Silakan coba lagi.');
    } finally {
      loading = false;
    }
  }

  async function handleSignUp(e: Event) {
    e.preventDefault();

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanFullName) {
      toast.error('Silakan isi nama lengkap Anda.');
      return;
    }

    if (!cleanEmail) {
      toast.error('Silakan isi email address Anda.');
      return;
    }

    if (!password) {
      toast.error('Silakan masukkan password.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok.');
      return;
    }

    loading = true;
    try {
      const res = await registerAccount({
        fullName: cleanFullName,
        email: cleanEmail,
        password,
      });

      if (!res.success) {
        toast.error(res.message || 'Gagal mendaftar.');
        return;
      }

      toast.success(`Pendaftaran berhasil! Selamat datang di COMMON, ${cleanFullName}.`);
      goto('/discover');
    } catch (err: any) {
      toast.error('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      loading = false;
    }
  }

  async function handleForgotPassword() {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.info('Silakan masukkan email address Anda terlebih dahulu pada kolom di atas.');
      return;
    }

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : '/login';

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error('Gagal mengirim tautan reset password. Pastikan email terdaftar.');
      } else {
        toast.success('Tautan pemulihan password telah dikirim ke email Anda.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat meminta reset password.');
    }
  }
</script>

<svelte:head>
  <title>{activeMode === 'signin' ? 'Sign in' : 'Sign up'} — COMMON</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F6F2] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full mx-auto space-y-7">
    
    <!-- Branding Header -->
    <div class="text-center space-y-2.5">
      <a href="/" class="inline-flex items-center gap-2 group">
        <div class="w-12 h-12 rounded-2xl bg-[#2F6B4F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
          <HeartHandshake class="w-7 h-7" />
        </div>
      </a>
      <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1C1A] tracking-tight">
        Selamat Datang di COMMON
      </h1>
      <p class="text-xs sm:text-sm text-[#736B5E] max-w-sm mx-auto leading-relaxed">
        Akses infrastruktur bersama untuk warga lingkungan. Pinjam alat berkualitas tanpa harus membeli sendiri.
      </p>
    </div>

    <!-- Main Authentication Card -->
    <div class="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm">
      
      <!-- Clean Tab Switcher: Sign In | Sign Up -->
      <div class="flex rounded-xl bg-[#F7F6F2] p-1 mb-6 border border-[#E5E0D8]">
        <button
          type="button"
          on:click={() => switchMode('signin')}
          class="flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center {
            activeMode === 'signin'
              ? 'bg-white text-[#1C1C1A] shadow-sm font-bold'
              : 'text-[#736B5E] hover:text-[#1C1C1A]'
          }"
        >
          Sign In
        </button>
        <button
          type="button"
          on:click={() => switchMode('signup')}
          class="flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center {
            activeMode === 'signup'
              ? 'bg-white text-[#1C1C1A] shadow-sm font-bold'
              : 'text-[#736B5E] hover:text-[#1C1C1A]'
          }"
        >
          Sign Up
        </button>
      </div>

      <!-- Continue with Google Button -->
      <button
        type="button"
        on:click={handleGoogleAuth}
        disabled={oauthLoading || loading}
        class="w-full py-2.5 px-4 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F7F6F2] hover:border-[#D5CFBF] text-[#1C1C1A] text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {#if oauthLoading}
          <Loader2 class="w-4 h-4 animate-spin text-[#736B5E]" />
          <span>Menghubungkan ke Google...</span>
        {:else}
          <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        {/if}
      </button>

      <!-- Divider with "or" -->
      <div class="relative my-6 text-center">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#E5E0D8]"></div>
        </div>
        <span class="relative bg-white px-3 text-xs text-[#736B5E] font-medium uppercase tracking-wider">
          or
        </span>
      </div>

      <!-- Form: Sign In vs Sign Up -->
      {#if activeMode === 'signin'}
        <!-- SIGN IN FORM -->
        <form on:submit={handleSignIn} class="space-y-4">
          <!-- Email Address -->
          <div>
            <label for="signin-email" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <Mail class="w-4 h-4" />
              </div>
              <input
                id="signin-email"
                type="email"
                bind:value={email}
                placeholder="nama@email.com"
                required
                autocomplete="email"
                disabled={loading}
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Password with Show/Hide -->
          <div>
            <label for="signin-password" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <Lock class="w-4 h-4" />
              </div>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                bind:value={password}
                placeholder="Masukkan kata sandi"
                required
                autocomplete="current-password"
                disabled={loading}
                class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                on:click={() => showPassword = !showPassword}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736B5E] hover:text-[#1C1C1A] focus:outline-none"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {#if showPassword}
                  <EyeOff class="w-4 h-4" />
                {:else}
                  <Eye class="w-4 h-4" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password Row -->
          <div class="flex items-center justify-between pt-0.5 text-xs">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                bind:checked={rememberMe}
                class="w-4 h-4 rounded border-[#E5E0D8] text-[#2F6B4F] focus:ring-[#2F6B4F] accent-[#2F6B4F]"
              />
              <span class="text-[#736B5E] hover:text-[#1C1C1A]">Ingat saya</span>
            </label>

            <button
              type="button"
              on:click={handleForgotPassword}
              class="text-[#2F6B4F] hover:underline font-semibold focus:outline-none"
            >
              Lupa password?
            </button>
          </div>

          <!-- Primary Sign In Button -->
          <button
            type="submit"
            disabled={loading || oauthLoading}
            class="w-full mt-2 py-3 px-4 rounded-xl bg-[#2F6B4F] hover:bg-[#25563F] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-[0.99]"
          >
            {#if loading}
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            {:else}
              <span>Sign in</span>
              <ArrowRight class="w-4 h-4" />
            {/if}
          </button>
        </form>

        <!-- Toggle to Sign Up -->
        <div class="text-center pt-5 border-t border-[#E5E0D8] mt-6">
          <p class="text-xs text-[#736B5E]">
            Belum punya akun?
            <button
              type="button"
              on:click={() => switchMode('signup')}
              class="text-[#2F6B4F] hover:underline font-semibold ml-1 focus:outline-none"
            >
              Sign up di sini
            </button>
          </p>
        </div>

      {:else}
        <!-- SIGN UP FORM -->
        <form on:submit={handleSignUp} class="space-y-4">
          <!-- Full Name -->
          <div>
            <label for="signup-name" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Full name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <User class="w-4 h-4" />
              </div>
              <input
                id="signup-name"
                type="text"
                bind:value={fullName}
                placeholder="Nama lengkap Anda"
                required
                autocomplete="name"
                disabled={loading}
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Email Address -->
          <div>
            <label for="signup-email" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <Mail class="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                bind:value={email}
                placeholder="nama@email.com"
                required
                autocomplete="email"
                disabled={loading}
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Password with Show/Hide -->
          <div>
            <label for="signup-password" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <Lock class="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                bind:value={password}
                placeholder="Minimal 6 karakter"
                required
                autocomplete="new-password"
                disabled={loading}
                class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                on:click={() => showPassword = !showPassword}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736B5E] hover:text-[#1C1C1A] focus:outline-none"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {#if showPassword}
                  <EyeOff class="w-4 h-4" />
                {:else}
                  <Eye class="w-4 h-4" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Confirm Password with Show/Hide -->
          <div>
            <label for="signup-confirm-password" class="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
              Konfirmasi password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B5E]">
                <Lock class="w-4 h-4" />
              </div>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                bind:value={confirmPassword}
                placeholder="Ulangi password di atas"
                required
                autocomplete="new-password"
                disabled={loading}
                class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F6F2] text-sm text-[#1C1C1A] placeholder-[#736B5E] focus:outline-none focus:border-[#2F6B4F] focus:bg-white transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                on:click={() => showConfirmPassword = !showConfirmPassword}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736B5E] hover:text-[#1C1C1A] focus:outline-none"
                aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {#if showConfirmPassword}
                  <EyeOff class="w-4 h-4" />
                {:else}
                  <Eye class="w-4 h-4" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Primary Sign Up Button -->
          <button
            type="submit"
            disabled={loading || oauthLoading}
            class="w-full mt-2 py-3 px-4 rounded-xl bg-[#2F6B4F] hover:bg-[#25563F] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-[0.99]"
          >
            {#if loading}
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            {:else}
              <span>Sign up</span>
              <ArrowRight class="w-4 h-4" />
            {/if}
          </button>
        </form>

        <!-- Toggle to Sign In -->
        <div class="text-center pt-5 border-t border-[#E5E0D8] mt-6">
          <p class="text-xs text-[#736B5E]">
            Sudah punya akun?
            <button
              type="button"
              on:click={() => switchMode('signin')}
              class="text-[#2F6B4F] hover:underline font-semibold ml-1 focus:outline-none"
            >
              Sign in di sini
            </button>
          </p>
        </div>
      {/if}
    </div>

    <!-- Back to Home Link -->
    <div class="text-center">
      <a
        href="/"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736B5E] hover:text-[#1C1C1A] transition-colors"
      >
        <Home class="w-3.5 h-3.5" />
        Kembali ke Beranda COMMON
      </a>
    </div>

  </div>
</div>

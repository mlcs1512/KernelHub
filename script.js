/* ==========================================================================
   KernelHub — application logic
   Vanilla JS. Data-driven: distros, comparisons, and quiz live in plain
   objects below, so expanding the site means editing data, not markup.
   ========================================================================== */
"use strict";

/* ==========================================================================
   DATA — Linux distributions
   ========================================================================== */
const DISTROS = [
  {
    id: "mint", name: "Linux Mint", logo: "🌿", difficulty: "beginner",
    users: "Windows switchers, everyday desktop users, older PCs",
    screenshot: "https://www.linuxmint.com/pictures/screenshots/xia/cinnamon.png",
    overview: "The most recommended beginner distro. Based on Ubuntu, with the traditional Cinnamon desktop that feels instantly familiar to Windows users. Everything works out of the box: codecs, drivers manager, update manager, software store.",
    install: [
      "Download the Cinnamon edition ISO from linuxmint.com and verify the SHA-256 sum.",
      "Flash it to a 4 GB+ USB with balenaEtcher or Rufus.",
      "Boot the USB (disable Secure Boot if it refuses) and try the live desktop.",
      "Double-click 'Install Linux Mint', choose 'Erase disk' or manual partitioning for dual-boot.",
      "Reboot, remove USB, run Update Manager and Driver Manager."
    ],
    customization: "Cinnamon has built-in themes, applets, desklets, and effects in System Settings. The Mint-Y theme family ships with accent colors; thousands more on cinnamon-spices.linuxmint.com.",
    pros: ["Extremely stable and polished", "Familiar Windows-like layout", "Great hardware support and driver GUI", "No snap packages forced on you"],
    cons: ["Ships older package versions", "Cinnamon lacks some modern touch/gesture polish", "Not ideal for bleeding-edge hardware"],
    issues: ["Wi-Fi on very new laptops may need a newer kernel (use the Edge ISO)", "NVIDIA optimus laptops: install the recommended driver via Driver Manager"]
  },
  {
    id: "zorin", name: "Zorin OS", logo: "💠", difficulty: "beginner",
    users: "Absolute beginners, macOS/Windows fans wanting a pretty desktop",
    screenshot: "https://assets.zorincdn.com/zorin.com/os/releases/17/desktop.jpg",
    overview: "A beautiful Ubuntu-based distro designed to feel premium from the first boot. Its Layouts feature switches the desktop between Windows-like, macOS-like, and touch layouts with one click.",
    install: [
      "Download Zorin OS Core (free) from zorin.com.",
      "Flash to USB with balenaEtcher, boot it, and select 'Try or Install'.",
      "The installer is standard Ubuntu (Ubiquity): language → keyboard → disk → user.",
      "After install, open Software Updater and Zorin Appearance to pick a layout."
    ],
    customization: "Zorin Appearance app: desktop layouts, accent colors, dark mode, jelly-mode animations. Pro version adds more layouts, but Core + GNOME extensions covers most needs.",
    pros: ["Gorgeous out-of-the-box design", "One-click desktop layout switching", "Windows app support helper (Wine integration)", "Solid Ubuntu LTS base"],
    cons: ["Best layouts locked behind paid Pro edition", "Heavier than Mint XFCE on old machines", "Release cycle lags Ubuntu LTS by months"],
    issues: ["GNOME extensions may break after major upgrades", "Some preinstalled Flatpaks duplicate apt apps — pick one source per app"]
  },
  {
    id: "ubuntu", name: "Ubuntu", logo: "🟠", difficulty: "beginner",
    users: "Beginners, developers, anyone wanting the biggest community",
    screenshot: "https://assets.ubuntu.com/v1/6ee34a00-desktop_2404.png",
    overview: "The most famous Linux distro. Backed by Canonical, with 6-month releases and 5-year LTS versions. Its enormous community means every problem you hit already has an answer online.",
    install: [
      "Download the LTS ISO from ubuntu.com (LTS = long-term support, recommended).",
      "Flash with balenaEtcher/Rufus, boot, and choose 'Install Ubuntu'.",
      "The new Flutter-based installer walks through disk, user, and optional proprietary drivers/codecs — tick that box.",
      "Reboot and run 'sudo apt update && sudo apt upgrade'."
    ],
    customization: "GNOME desktop with Ubuntu's dock. Customize via GNOME Tweaks + Extensions (gnome-shell-extension-manager). Accent colors and dark mode are built into Settings.",
    pros: ["Massive community and documentation", "First-class developer/server ecosystem", "5-year LTS support", "Best third-party software targeting (vendors ship .deb for Ubuntu)"],
    cons: ["Snap packages are slower to start and forced for some apps (Firefox)", "GNOME workflow differs from Windows", "Heavier resource use than Mint/XFCE"],
    issues: ["Snap Firefox can't access some system dirs — install the .deb from Mozilla's PPA if it bothers you", "NVIDIA: use 'Additional Drivers' tool, avoid manual .run installers"]
  },
  {
    id: "fedora", name: "Fedora", logo: "🎩", difficulty: "beginner",
    users: "Developers, modern-hardware owners, users wanting cutting-edge but stable",
    screenshot: "https://fedoraproject.org/assets/images/f41-workstation.webp",
    overview: "Sponsored by Red Hat, Fedora Workstation ships the newest stable kernel, GNOME, and toolchains ~every 6 months while staying remarkably reliable. It's what many kernel and GNOME developers run.",
    install: [
      "Download Fedora Workstation ISO or use Fedora Media Writer (it downloads + flashes in one step).",
      "Boot the USB; the Anaconda installer handles partitioning (automatic is fine).",
      "After install: 'sudo dnf upgrade --refresh', then enable RPM Fusion repos for codecs/NVIDIA."
    ],
    customization: "Vanilla GNOME: clean but minimal by default. Add GNOME Tweaks, Extension Manager, and themes. KDE/XFCE/Cinnamon 'Spins' are available if GNOME isn't your taste.",
    pros: ["Newest tech (kernel, Wayland, PipeWire) with excellent QA", "Clean vanilla GNOME", "Strong security defaults (SELinux)", "Great for modern laptops"],
    cons: ["~13-month support per release — you must upgrade yearly", "Patented codecs/NVIDIA need RPM Fusion setup", "Less beginner hand-holding than Mint/Zorin"],
    issues: ["Video playback broken until you swap in full ffmpeg from RPM Fusion", "Secure Boot + NVIDIA requires signing kernel modules (or disabling Secure Boot)"]
  },
  {
    id: "debian", name: "Debian", logo: "🌀", difficulty: "intermediate",
    users: "Servers, stability purists, users who want zero surprises",
    screenshot: "https://www.debian.org/Pics/homepage/screenshot-desktop.png",
    overview: "The 'universal operating system' — the rock-solid base Ubuntu and Mint build upon. Releases every ~2 years, frozen and tested to extremes. Perfect when you want a machine to just keep working for years.",
    install: [
      "Download the netinst ISO (includes non-free firmware since Debian 12).",
      "Flash and boot; choose the graphical installer.",
      "It asks more questions than Ubuntu (mirror, tasksel) — pick your desktop in 'tasksel' (GNOME default, KDE/XFCE available).",
      "Add your user to sudoers or set a root password during install."
    ],
    customization: "Whatever your chosen desktop offers. Debian doesn't reskin anything — you get stock GNOME/KDE/XFCE and full freedom.",
    pros: ["Legendary stability", "Huge package repository (~60,000)", "Very light on resources (XFCE/LXQt spins)", "Community-run, no corporate agenda"],
    cons: ["Old package versions by design", "Installer less polished than Ubuntu's", "New hardware may need backports kernel"],
    issues: ["Very new GPUs/Wi-Fi need the backports kernel: enable bookworm-backports and install linux-image", "Flatpak recommended for up-to-date desktop apps"]
  },
  {
    id: "opensuse", name: "openSUSE", logo: "🦎", difficulty: "intermediate",
    users: "Sysadmins, KDE fans, users who love GUI system tools",
    screenshot: "https://en.opensuse.org/images/thumb/1/16/Screenshot-leap-15-kde.png/800px-Screenshot-leap-15-kde.png",
    overview: "A German-engineered distro in two flavors: Leap (fixed release, enterprise-grade) and Tumbleweed (tested rolling release). Famous for YaST — the most powerful graphical system-configuration suite on Linux — and automatic Btrfs snapshots.",
    install: [
      "Choose Leap (stable) or Tumbleweed (rolling) at get.opensuse.org.",
      "Flash the ISO, boot, and follow the installer — it's detailed but well-organized.",
      "Keep the default Btrfs filesystem: it enables Snapper rollbacks.",
      "Pick KDE Plasma (flagship), GNOME, or XFCE during install."
    ],
    customization: "KDE Plasma is the showcase desktop — themes, widgets, window rules, everything is configurable. YaST controls services, firewall, boot, and more from one GUI.",
    pros: ["Snapper snapshots: roll back bad updates from the boot menu", "YaST GUI admin tools", "Tumbleweed = rolling release with real QA (openQA)", "Excellent KDE integration"],
    cons: ["Smaller community than Ubuntu/Fedora", "Patented codecs need the Packman repo", "YaST can conflict with manual config edits"],
    issues: ["Install codecs via 'opi codecs' one-liner", "Tumbleweed updates are large — use 'zypper dup' not 'zypper up'"]
  },
  {
    id: "endeavour", name: "EndeavourOS", logo: "🚀", difficulty: "intermediate",
    users: "Users who want Arch power without the manual install",
    screenshot: "https://endeavouros.com/wp-content/uploads/2023/10/Galileo-full.png",
    overview: "Arch Linux with a friendly graphical installer and helpful defaults, while staying close to vanilla Arch. You get the AUR, rolling releases, and the Arch Wiki — minus the intimidating setup.",
    install: [
      "Download the ISO, flash, and boot into a live XFCE desktop.",
      "Run the Calamares installer; choose offline (XFCE) or online (pick KDE/GNOME/i3 and more).",
      "Post-install, the Welcome app handles mirrors, updates, and common tasks.",
      "Learn 'yay' — it installs from both repos and the AUR."
    ],
    customization: "Whatever desktop you chose, near-vanilla. Arch's rolling nature means the newest versions of every DE/WM; the AUR has every theming tool imaginable.",
    pros: ["Arch + AUR without manual installation", "Rolling release — always current", "Helpful, friendly community", "Close to vanilla Arch (Arch Wiki applies)"],
    cons: ["Rolling updates occasionally need manual intervention", "Terminal-centric philosophy (update via 'yay', no GUI store by default)", "Not for set-and-forget machines"],
    issues: ["Always read the EndeavourOS/Arch news before big updates", "Keep the fallback kernel installed in case a kernel update misbehaves"]
  },
  {
    id: "arch", name: "Arch Linux", logo: "🏔️", difficulty: "advanced",
    users: "Power users, minimalists, people who want to understand their system",
    screenshot: "https://wiki.archlinux.org/images/thumb/6/63/KDE_Plasma_5.png/800px-KDE_Plasma_5.png",
    overview: "A DIY rolling-release distro: you build the system yourself from a command-line base, installing only what you need. The reward is total control, the newest software, and the Arch Wiki — the best documentation in all of Linux.",
    install: [
      "Boot the ISO into a root shell — there is no graphical installer (though 'archinstall' automates most steps).",
      "Partition disks (fdisk/cfdisk), format, mount, and 'pacstrap' the base system.",
      "chroot in, configure locale/time/bootloader (GRUB or systemd-boot), create users.",
      "Install your desktop: e.g. 'pacman -S plasma sddm' and enable services.",
      "Read the Installation Guide on the Arch Wiki — it is the canonical walkthrough."
    ],
    customization: "Unlimited — you chose every package, so nothing is in your way. Tiling window managers (Hyprland, i3, sway) are first-class citizens. The AUR has ~85,000 community packages.",
    pros: ["Total control and minimal bloat", "AUR: nearly every piece of Linux software ever", "The Arch Wiki", "Rolling release — never reinstall"],
    cons: ["Manual install and maintenance burden", "Updates can occasionally break things", "You are your own support team"],
    issues: ["Read archlinux.org news before updating after long gaps", "Partial upgrades are unsupported — always 'pacman -Syu' fully", "Keep a live USB handy for chroot rescues"]
  },
  {
    id: "gentoo", name: "Gentoo", logo: "🧪", difficulty: "advanced",
    users: "Source-code purists, performance tuners, Linux masochists (affectionately)",
    screenshot: "https://www.gentoo.org/assets/img/screenshots/plasma.webp",
    overview: "A source-based meta-distribution: Portage compiles (nearly) every package from source with your chosen USE flags, letting you strip features you don't want at compile time. Maximum flexibility, maximum compile times.",
    install: [
      "Boot any live environment and follow the Gentoo Handbook (the install IS the handbook).",
      "Partition, extract a stage3 tarball, configure make.conf (CFLAGS, USE flags, MAKEOPTS).",
      "Compile the kernel — manually or with 'genkernel'/distribution kernels.",
      "Emerge your desktop (@world updates can take hours on big desktops like KDE).",
      "Set up bootloader, users, and services (OpenRC or systemd — your choice)."
    ],
    customization: "The deepest on any distro: USE flags shape features per-package, you pick init system, and everything is compiled to your exact hardware.",
    pros: ["Ultimate compile-time customization", "Choice of init system (OpenRC/systemd)", "Superb documentation (Gentoo Wiki)", "You'll learn more Linux than anywhere else"],
    cons: ["Compiling everything takes hours-to-days", "High maintenance commitment", "Overkill for typical desktop use"],
    issues: ["Watch for USE-flag conflicts during world updates", "Use binary packages (now offered!) for monsters like Firefox/LibreOffice to save hours"]
  },
  {
    id: "nixos", name: "NixOS", logo: "❄️", difficulty: "advanced",
    users: "DevOps engineers, reproducibility fans, config-as-code believers",
    screenshot: "https://nixos.org/images/screenshots/nixos-gnome.png",
    overview: "A radically different distro: the entire system — packages, services, users, settings — is declared in one configuration file. Rebuilds are atomic, rollbacks are instant, and the same config reproduces the same machine anywhere.",
    install: [
      "Boot the graphical ISO and use the Calamares installer for a first taste.",
      "The real workflow: edit /etc/nixos/configuration.nix to describe your system.",
      "Apply with 'sudo nixos-rebuild switch' — every change is a new bootable generation.",
      "Broke something? Select the previous generation in the boot menu. Instant rollback.",
      "Level up with flakes and home-manager for per-user declarative config."
    ],
    customization: "Everything is code. Your desktop, packages, dotfiles (via home-manager) live in version-controlled .nix files — clone them onto a new machine and rebuild an identical system.",
    pros: ["Atomic upgrades + instant rollbacks", "Reproducible: your config IS your system", "nixpkgs is the largest package repo in Linux", "Multiple package versions coexist happily"],
    cons: ["Steep learning curve (Nix language)", "Non-standard filesystem layout breaks some third-party binaries", "Documentation lags the ecosystem's pace"],
    issues: ["Random downloaded binaries won't run without patching or steam-run/nix-ld", "Learn 'nix flakes' early — most modern guides assume them"]
  }
];

/* ==========================================================================
   DATA — Comparison tables
   ========================================================================== */
const star = n => `<span class="stars">${"★".repeat(n)}<span class="dim">${"★".repeat(5 - n)}</span></span>`;

const CMP_OS = {
  head: ["Category", "Windows", "Linux", "macOS", "Hackintosh"],
  rows: [
    ["Gaming", star(5), star(4), star(2), star(2)],
    ["Privacy", star(2), star(5), star(3), star(3)],
    ["Performance", star(3), star(5), star(4), star(4)],
    ["Customization", star(2), star(5), star(2), star(3)],
    ["Software support", star(5), star(3), star(4), star(4)],
    ["Hardware support", star(5), star(4), star(2), star(2)],
    ["Difficulty (ease)", star(4), star(3), star(5), star(1)]
  ]
};

const CMP_WIN = {
  head: ["Aspect", "Windows 7", "Windows 8", "Windows 8.1", "Windows 10", "Windows 11"],
  rows: [
    ["Released", "2009", "2012", "2013", "2015", "2021"],
    ["Support status", "Ended 2020", "Ended 2016", "Ended 2023", "Ended Oct 2025 (ESU/LTSC)", "Active"],
    ["Min RAM", "1–2 GB", "1–2 GB", "1–2 GB", "2 GB", "4 GB"],
    ["TPM required", "No", "No", "No", "No", "Yes (2.0)"],
    ["UI style", "Aero desktop", "Metro tiles", "Metro refined", "Hybrid Start", "Centered, rounded"],
    ["Gaming (modern)", "Poor", "Poor", "Poor", "Great", "Best (DirectStorage)"],
    ["Old hardware", "Excellent", "Great", "Great", "Great", "Poor"],
    ["Best for", "Retro/offline", "Skip it", "Offline/VMs", "Older PCs, stability", "Modern PCs, gaming"]
  ]
};

const CMP_DISTRO = {
  head: ["Distro", "Difficulty", "Release model", "Package manager", "Default desktop", "Best for"],
  rows: [
    ["Linux Mint", "Beginner", "LTS (2 yr)", "apt", "Cinnamon", "Windows switchers"],
    ["Zorin OS", "Beginner", "LTS-based", "apt", "GNOME (custom)", "Beautiful defaults"],
    ["Ubuntu", "Beginner", "6 mo / LTS", "apt + snap", "GNOME", "Community & dev support"],
    ["Fedora", "Beginner+", "~6 months", "dnf", "GNOME", "Modern hardware, devs"],
    ["Debian", "Intermediate", "~2 years", "apt", "GNOME (choice)", "Stability, servers"],
    ["openSUSE", "Intermediate", "Leap / rolling", "zypper", "KDE Plasma", "Snapshots, YaST"],
    ["EndeavourOS", "Intermediate", "Rolling", "pacman + AUR", "XFCE (choice)", "Easy Arch"],
    ["Arch Linux", "Advanced", "Rolling", "pacman + AUR", "None (DIY)", "Total control"],
    ["Gentoo", "Advanced", "Rolling (source)", "portage", "None (DIY)", "Compile-time tuning"],
    ["NixOS", "Advanced", "6 mo / rolling", "nix", "GNOME (choice)", "Declarative systems"]
  ]
};

/* ==========================================================================
   DATA — Quiz
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    q: "How experienced are you with computers?",
    opts: [
      { t: "I just browse and use basic apps", w: { win11: 2, win10: 2, mint: 3, macos: 2 } },
      { t: "Comfortable — I can install software and tweak settings", w: { win11: 2, win10: 1, mint: 2, fedora: 2 } },
      { t: "Advanced — I've used the command line", w: { fedora: 3, arch: 2, hack: 1 } },
      { t: "Expert — I live in the terminal", w: { arch: 4, fedora: 1, hack: 2 } }
    ]
  },
  {
    q: "How important is gaming to you?",
    opts: [
      { t: "It's the main reason I own a PC", w: { win11: 4, win10: 2 } },
      { t: "I game sometimes, nothing competitive", w: { win11: 2, fedora: 2, mint: 1 } },
      { t: "Rarely or light/indie games only", w: { mint: 2, fedora: 2, macos: 1, hack: 1 } },
      { t: "I don't game at all", w: { mint: 2, fedora: 2, macos: 2, arch: 1, hack: 1 } }
    ]
  },
  {
    q: "How much do you care about privacy?",
    opts: [
      { t: "Maximum — I want full control of my data", w: { arch: 3, fedora: 3, mint: 2 } },
      { t: "It matters, but convenience matters too", w: { fedora: 2, mint: 2, macos: 2 } },
      { t: "I'm fine with mainstream defaults", w: { win11: 2, win10: 1, macos: 2 } },
      { t: "I've never really thought about it", w: { win11: 2, win10: 1 } }
    ]
  },
  {
    q: "How much do you want to customize your desktop?",
    opts: [
      { t: "Everything — I want to build my own experience", w: { arch: 4, fedora: 1 } },
      { t: "Themes and layouts, within reason", w: { mint: 2, fedora: 2, win10: 1 } },
      { t: "A little — mostly wallpaper and dark mode", w: { win11: 2, macos: 2, mint: 1 } },
      { t: "Zero — give me polished defaults", w: { macos: 3, win11: 2 } }
    ]
  },
  {
    q: "How old is your computer?",
    opts: [
      { t: "Brand new / last 3 years", w: { win11: 3, fedora: 2, macos: 1 } },
      { t: "4–8 years old", w: { win10: 2, fedora: 2, mint: 2, hack: 2 } },
      { t: "Older than 8 years", w: { mint: 3, win10: 2 } },
      { t: "I'm building/choosing one now", w: { win11: 2, hack: 2, arch: 1, fedora: 1 } }
    ]
  },
  {
    q: "Do you need professional software (Adobe, MS Office, AutoCAD…)?",
    opts: [
      { t: "Yes — industry-standard apps, non-negotiable", w: { win11: 3, macos: 3, win10: 1 } },
      { t: "Sometimes, but web/alternatives could work", w: { win11: 1, macos: 1, fedora: 2, mint: 2 } },
      { t: "No — browsers, media, and open-source tools cover me", w: { mint: 3, fedora: 2, arch: 1 } },
      { t: "I need developer tools above all", w: { fedora: 3, arch: 2, macos: 2 } }
    ]
  },
  {
    q: "When something breaks, how willing are you to troubleshoot?",
    opts: [
      { t: "Not at all — it should just work", w: { macos: 3, win11: 2, mint: 1 } },
      { t: "I'll follow a guide if it's clear", w: { mint: 3, win10: 2, fedora: 1 } },
      { t: "I enjoy solving problems", w: { fedora: 3, arch: 2, hack: 1 } },
      { t: "Troubleshooting IS the hobby", w: { arch: 3, hack: 4 } }
    ]
  }
];

const QUIZ_RESULTS = {
  win11: {
    name: "Windows 11", logo: "🪟", route: "windows",
    why: "You want modern gaming performance, broad software compatibility, and a system that works with minimal fuss on recent hardware. Windows 11 is the mainstream powerhouse.",
    pros: ["Best-in-class gaming (DirectX 12 Ultimate, DirectStorage)", "Runs virtually all commercial software", "Long support runway"],
    cons: ["Telemetry and ads need taming", "Strict hardware requirements"],
    steps: ["Read our Windows 11 guide (requirements, TPM, Secure Boot)", "Create install media with the Media Creation Tool", "Follow our optimization & debloating sections after install"]
  },
  win10: {
    name: "Windows 10", logo: "🖥️", route: "windows",
    why: "Your hardware or preference favors stability over novelty. Windows 10 runs beautifully on older machines and skips Windows 11's hardware gatekeeping.",
    pros: ["Runs on almost any PC from the last 15 years", "Mature and predictable", "LTSC variants supported for years"],
    cons: ["Mainstream support ended Oct 2025 (ESU needed)", "No new features coming"],
    steps: ["Read our Windows 10 guide", "Use the Media Creation Tool for a USB installer", "Apply our privacy settings checklist post-install"]
  },
  mint: {
    name: "Linux Mint / Zorin OS", logo: "🌿", route: "linux",
    why: "You want an easy, private, no-cost system that feels familiar. Mint (and Zorin) give you a polished Linux desktop that just works — perfect first distros.",
    pros: ["Free, fast, private", "Familiar desktop layout", "Revives older hardware brilliantly"],
    cons: ["No native Adobe/MS Office (web versions work)", "Anti-cheat games don't run"],
    steps: ["Open the Linux section and read the Mint & Zorin cards", "Flash a live USB and test-drive without installing", "Install alongside or instead of your current OS"]
  },
  fedora: {
    name: "Fedora", logo: "🎩", route: "linux",
    why: "You're technical, value privacy and modern tech, and want a system that respects you without demanding constant maintenance. Fedora is the sweet spot.",
    pros: ["Cutting-edge but reliable", "Excellent developer experience", "Strong security defaults"],
    cons: ["Yearly upgrades required", "Codecs/NVIDIA need RPM Fusion setup"],
    steps: ["Read the Fedora card in our Linux database", "Create a live USB with Fedora Media Writer", "Enable RPM Fusion right after installing"]
  },
  arch: {
    name: "Arch Linux", logo: "🏔️", route: "linux",
    why: "You want total control, the newest software, and to understand every part of your system. Arch gives you exactly the OS you build — nothing more, nothing less.",
    pros: ["Ultimate customization and minimalism", "The Arch Wiki + AUR", "Rolling release, never reinstall"],
    cons: ["You maintain it yourself", "Occasional breakage needs attention"],
    steps: ["Read the Arch card in our Linux database", "Try EndeavourOS first if you want a shortcut", "Follow the official Installation Guide in a VM before bare metal"]
  },
  hack: {
    name: "Hackintosh", logo: "🍏", route: "hackintosh",
    why: "You're a hardware enthusiast who enjoys deep technical projects and wants macOS without Apple prices. Building a Hackintosh is the ultimate tinkerer's challenge.",
    pros: ["macOS on your chosen hardware", "Deeply educational project", "Great performance per dollar"],
    cons: ["Requires compatible hardware + patience", "Updates can break; Intel macOS is sunsetting"],
    steps: ["Read our full Hackintosh guide and hardware compatibility list", "Verify your CPU/GPU before anything else", "Use OpCore-Simplify + the Dortania guide"]
  },
  macos: {
    name: "macOS", logo: "🍎", route: "compare",
    why: "You value polish, zero-maintenance reliability, and a premium ecosystem over tinkering. A real Mac gives you Unix power with none of the setup.",
    pros: ["Seamless hardware + software integration", "Great for creative and dev work", "Long device support"],
    cons: ["Expensive hardware", "Limited gaming and customization"],
    steps: ["Compare macOS against the others in our Compare section", "If you own a PC, read the Hackintosh guide as an alternative", "Consider a used M1 Mac for incredible value"]
  }
};

/* ==========================================================================
   DATA — Search index
   ========================================================================== */
const SEARCH_INDEX = [
  { section: "Home", title: "KernelHub Home", route: "home", kw: "start hero explore quiz" },
  { section: "Windows", title: "Windows 7 Guide", route: "windows", tab: "win7", kw: "windows 7 legacy aero retro requirements installation drivers" },
  { section: "Windows", title: "Windows 8 Guide", route: "windows", tab: "win8", kw: "windows 8 metro tiles installation compatibility interface" },
  { section: "Windows", title: "Windows 8.1 Guide", route: "windows", tab: "win81", kw: "windows 8.1 improvements installation modern" },
  { section: "Windows", title: "Windows 10 Guide", route: "windows", tab: "win10", kw: "windows 10 usb installation drivers optimization privacy ltsc" },
  { section: "Windows", title: "Windows 11 Guide", route: "windows", tab: "win11", kw: "windows 11 tpm secure boot requirements unsupported debloat optimization" },
  { section: "Linux", title: "What is Linux?", route: "linux", kw: "linux kernel distributions desktop environments package managers terminal customization" },
  ...DISTROS.map(d => ({ section: "Linux", title: d.name, route: "linux", distro: d.id, kw: `${d.name} ${d.difficulty} ${d.users} linux distro` })),
  { section: "Hackintosh", title: "Hackintosh Guide", route: "hackintosh", kw: "hackintosh opencore macos pc efi kext bios smbios dortania" },
  { section: "Compare", title: "OS Comparison Tables", route: "compare", kw: "compare comparison gaming privacy performance customization windows linux macos" },
  { section: "Quiz", title: "OS Quiz", route: "quiz", kw: "quiz recommendation what os test questions" },
  { section: "About", title: "About KernelHub", route: "about", kw: "about mission principles" }
];

/* ==========================================================================
   Helpers
   ========================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

/* ==========================================================================
   Router — hash-based page switching
   ========================================================================== */
const ROUTES = ["home", "windows", "linux", "hackintosh", "compare", "quiz", "about"];

function navigate(route, { scroll = true } = {}) {
  if (!ROUTES.includes(route)) route = "home";
  $$(".page").forEach(p => p.classList.toggle("active", p.dataset.page === route));
  $$(".nav-links a").forEach(a => a.classList.toggle("active", a.dataset.route === route));
  $("#navLinks").classList.remove("open");
  $("#navBurger").setAttribute("aria-expanded", "false");
  if (location.hash !== `#${route}`) history.replaceState(null, "", `#${route}`);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(observeReveals);
}

document.addEventListener("click", e => {
  const link = e.target.closest("[data-route]");
  if (!link) return;
  e.preventDefault();
  navigate(link.dataset.route);
});

window.addEventListener("hashchange", () => navigate(location.hash.slice(1), { scroll: false }));

/* ==========================================================================
   Theme toggle
   ========================================================================== */
function initTheme() {
  const saved = store.get("kh-theme", null);
  if (saved) document.documentElement.dataset.theme = saved;
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("kh-theme", next);
  });
}

/* ==========================================================================
   Mobile nav
   ========================================================================== */
function initNav() {
  const burger = $("#navBurger");
  burger.addEventListener("click", () => {
    const open = $("#navLinks").classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
}

/* ==========================================================================
   Reading progress + back-to-top
   ========================================================================== */
function initScrollUI() {
  const bar = $("#progressBar");
  const backTop = $("#backTop");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    backTop.hidden = scrollY < 500;
  }, { passive: true });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ==========================================================================
   Scroll reveal animations
   ========================================================================== */
let revealObserver;
function observeReveals() {
  revealObserver ??= new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal:not(.in)").forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Tabs (Windows versions, compare tabs, distro filters)
   ========================================================================== */
function initTabs() {
  // Windows version tabs
  $$("[data-tab]").forEach(btn => btn.addEventListener("click", () => activateWinTab(btn.dataset.tab)));
  // Compare tabs
  $$("[data-ctab]").forEach(btn => btn.addEventListener("click", () => {
    $$("[data-ctab]").forEach(b => b.classList.toggle("active", b === btn));
    $$(".ctab-panel").forEach(p => p.classList.toggle("active", p.id === `ctab-${btn.dataset.ctab}`));
  }));
  // Distro difficulty filter
  $$("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    $$("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    $$(".distro-card").forEach(card => card.classList.toggle("hidden", f !== "all" && card.dataset.difficulty !== f));
  }));
}

function activateWinTab(tab) {
  $$("[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  $$("#page-windows .tab-panel").forEach(p => p.classList.toggle("active", p.id === `tab-${tab}`));
}

/* ==========================================================================
   Linux distro cards + modal
   ========================================================================== */
function renderDistros() {
  $("#distroGrid").innerHTML = DISTROS.map(d => `
    <div class="distro-card" data-difficulty="${d.difficulty}" data-fav-id="distro-${d.id}" data-fav-title="${d.name}">
      <button class="fav-toggle" aria-label="Bookmark ${d.name}">♡</button>
      <div class="distro-logo">${d.logo}</div>
      <span class="badge badge-${d.difficulty}">${d.difficulty}</span>
      <h3>${d.name}</h3>
      <p class="distro-users">For: ${d.users}</p>
      <button class="distro-open" data-distro="${d.id}">Open full guide →</button>
    </div>`).join("");
}

function openDistroModal(id) {
  const d = DISTROS.find(x => x.id === id);
  if (!d) return;
  $("#modalBody").innerHTML = `
    <div class="modal-meta">
      <span style="font-size:2.2rem">${d.logo}</span>
      <h2>${d.name}</h2>
      <span class="badge badge-${d.difficulty}">${d.difficulty}</span>
    </div>
    <p><strong>Recommended for:</strong> ${d.users}</p>
    <div class="screenshot"><img src="${d.screenshot}" alt="${d.name} desktop screenshot" loading="lazy"
      onerror="this.parentElement.style.display='none'"></div>
    <h3>Overview</h3><p>${d.overview}</p>
    <h3>Installation guide</h3><ol>${d.install.map(s => `<li>${s}</li>`).join("")}</ol>
    <h3>Customization</h3><p>${d.customization}</p>
    <div class="pros-cons">
      <div class="pros"><h4>Pros</h4><ul>${d.pros.map(p => `<li>${p}</li>`).join("")}</ul></div>
      <div class="cons"><h4>Cons</h4><ul>${d.cons.map(c => `<li>${c}</li>`).join("")}</ul></div>
    </div>
    <h3>Common issues</h3><ul>${d.issues.map(i => `<li>${i}</li>`).join("")}</ul>`;
  $("#distroModal").hidden = false;
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}

function closeModal() {
  $("#distroModal").hidden = true;
  document.body.style.overflow = "";
}

function initModal() {
  document.addEventListener("click", e => {
    const open = e.target.closest("[data-distro]");
    if (open) return openDistroModal(open.dataset.distro);
    if (e.target === $("#distroModal") || e.target.closest("#modalClose")) closeModal();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#distroModal").hidden) closeModal(); });
}

/* ==========================================================================
   Comparison tables
   ========================================================================== */
function renderTable(el, data) {
  el.innerHTML = `
    <thead><tr>${data.head.map((h, i) => `<th data-col="${i}" tabindex="0" role="button" aria-label="Highlight ${h}">${h}</th>`).join("")}</tr></thead>
    <tbody>${data.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
  const highlight = th => {
    const col = +th.dataset.col;
    $$("td, th", el).forEach(cell => cell.classList.remove("hl"));
    if (col === 0 || th.classList.contains("was-hl")) { $$("th", el).forEach(h => h.classList.remove("was-hl")); return; }
    $$("th", el).forEach(h => h.classList.remove("was-hl"));
    th.classList.add("was-hl");
    $$("tr", el).forEach(row => row.children[col]?.classList.add("hl"));
  };
  $$("thead th", el).forEach(th => {
    th.addEventListener("click", () => highlight(th));
    th.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); highlight(th); } });
  });
}

function renderCompare() {
  renderTable($("#cmpOsTable"), CMP_OS);
  renderTable($("#cmpWinTable"), CMP_WIN);
  renderTable($("#cmpDistroTable"), CMP_DISTRO);
}

/* ==========================================================================
   Quiz
   ========================================================================== */
const quiz = { step: -1, scores: {}, history: [] };

function quizRender() {
  const stage = $("#quizStage");
  const fill = $("#quizProgressFill");

  if (quiz.step === -1) {
    fill.style.width = "0%";
    stage.innerHTML = `
      <div class="quiz-intro">
        <div class="quiz-icon">🧭</div>
        <h2>Find your match</h2>
        <p>We'll ask about your experience, gaming needs, privacy priorities, hardware, and patience for troubleshooting — then recommend the OS that genuinely fits.</p>
        <button class="btn btn-primary" id="quizStart">Start the Quiz</button>
      </div>`;
    $("#quizStart").addEventListener("click", () => { quiz.step = 0; quizRender(); });
    return;
  }

  if (quiz.step >= QUIZ_QUESTIONS.length) return quizResult();

  const q = QUIZ_QUESTIONS[quiz.step];
  fill.style.width = `${(quiz.step / QUIZ_QUESTIONS.length) * 100}%`;
  stage.innerHTML = `
    <div class="quiz-question">
      <span class="quiz-qnum">Question ${quiz.step + 1} of ${QUIZ_QUESTIONS.length}</span>
      <h2>${q.q}</h2>
      <div class="quiz-options">
        ${q.opts.map((o, i) => `<button class="quiz-option" data-opt="${i}">${o.t}</button>`).join("")}
      </div>
      ${quiz.step > 0 ? '<button class="quiz-back" id="quizBack">← Back</button>' : ""}
    </div>`;
  $$(".quiz-option", stage).forEach(btn => btn.addEventListener("click", () => {
    const opt = q.opts[+btn.dataset.opt];
    quiz.history.push(opt.w);
    for (const [k, v] of Object.entries(opt.w)) quiz.scores[k] = (quiz.scores[k] || 0) + v;
    quiz.step++;
    quizRender();
  }));
  $("#quizBack")?.addEventListener("click", () => {
    const last = quiz.history.pop();
    if (last) for (const [k, v] of Object.entries(last)) quiz.scores[k] -= v;
    quiz.step--;
    quizRender();
  });
}

function quizResult() {
  $("#quizProgressFill").style.width = "100%";
  const winner = Object.entries(quiz.scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "mint";
  const r = QUIZ_RESULTS[winner];
  $("#quizStage").innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-logo">${r.logo}</div>
      <span class="quiz-qnum">Your recommendation</span>
      <h2>${r.name}</h2>
      <p class="quiz-why">${r.why}</p>
      <div class="pros-cons">
        <div class="pros"><h4>Pros</h4><ul>${r.pros.map(p => `<li>${p}</li>`).join("")}</ul></div>
        <div class="cons"><h4>Cons</h4><ul>${r.cons.map(c => `<li>${c}</li>`).join("")}</ul></div>
      </div>
      <div class="quiz-next-steps"><h4>Next steps</h4><ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol></div>
      <div class="quiz-actions">
        <a href="#${r.route}" class="btn btn-primary" data-route="${r.route}">Open the ${r.name.split(" ")[0]} guide</a>
        <button class="btn btn-glass" id="quizRetry">Retake Quiz</button>
      </div>
    </div>`;
  $("#quizRetry").addEventListener("click", () => {
    quiz.step = -1; quiz.scores = {}; quiz.history = [];
    quizRender();
  });
}

/* ==========================================================================
   Search
   ========================================================================== */
function initSearch() {
  const overlay = $("#searchOverlay");
  const input = $("#searchInput");
  const results = $("#searchResults");
  let selIdx = -1;

  const open = () => { overlay.hidden = false; input.value = ""; renderResults(""); input.focus(); document.body.style.overflow = "hidden"; };
  const close = () => { overlay.hidden = true; document.body.style.overflow = ""; };

  function renderResults(q) {
    selIdx = -1;
    const term = q.trim().toLowerCase();
    const matches = term
      ? SEARCH_INDEX.filter(it => (it.title + " " + it.kw).toLowerCase().includes(term))
      : SEARCH_INDEX.slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map((m, i) => `<li><button data-idx="${SEARCH_INDEX.indexOf(m)}"><span class="sr-section">${m.section}</span>${m.title}</button></li>`).join("")
      : `<li><div class="sr-empty">No results for “${q}”</div></li>`;
  }

  function go(item) {
    close();
    navigate(item.route);
    if (item.tab) activateWinTab(item.tab);
    if (item.distro) setTimeout(() => openDistroModal(item.distro), 150);
  }

  $("#searchBtn").addEventListener("click", open);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  input.addEventListener("input", () => renderResults(input.value));
  results.addEventListener("click", e => {
    const btn = e.target.closest("button[data-idx]");
    if (btn) go(SEARCH_INDEX[+btn.dataset.idx]);
  });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); overlay.hidden ? open() : close(); }
    if (overlay.hidden) return;
    const items = $$("button[data-idx]", results);
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { e.preventDefault(); selIdx = Math.min(selIdx + 1, items.length - 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); }
    else if (e.key === "Enter" && selIdx >= 0) { items[selIdx].click(); return; }
    items.forEach((it, i) => it.classList.toggle("sel", i === selIdx));
    items[selIdx]?.scrollIntoView({ block: "nearest" });
  });
}

/* ==========================================================================
   Favorites / bookmarks (localStorage)
   ========================================================================== */
function initFavorites() {
  const drawer = $("#favDrawer");
  let favs = store.get("kh-favs", []); // [{id, title}]

  const isFaved = id => favs.some(f => f.id === id);

  function syncUI() {
    store.set("kh-favs", favs);
    $("#favCount").textContent = favs.length;
    $("#favCount").hidden = favs.length === 0;
    $$("[data-fav-id]").forEach(el => {
      const btn = $(".fav-toggle", el);
      if (!btn) return;
      const faved = isFaved(el.dataset.favId);
      btn.classList.toggle("faved", faved);
      btn.textContent = faved ? "♥" : "♡";
    });
    $("#favList").innerHTML = favs.map(f => `
      <li>
        <button class="fav-go" data-fav-go="${f.id}">${f.title}</button>
        <button class="fav-del" data-fav-del="${f.id}" aria-label="Remove ${f.title}">✕</button>
      </li>`).join("");
    $("#favEmpty").style.display = favs.length ? "none" : "block";
  }

  document.addEventListener("click", e => {
    const toggle = e.target.closest(".fav-toggle");
    if (toggle) {
      e.preventDefault(); e.stopPropagation();
      const host = toggle.closest("[data-fav-id]");
      if (!host) return;
      const { favId: id, favTitle: title } = host.dataset;
      favs = isFaved(id) ? favs.filter(f => f.id !== id) : [...favs, { id, title }];
      syncUI();
      return;
    }
    const del = e.target.closest("[data-fav-del]");
    if (del) { favs = favs.filter(f => f.id !== del.dataset.favDel); syncUI(); return; }
    const go = e.target.closest("[data-fav-go]");
    if (go) {
      const id = go.dataset.favGo;
      drawer.hidden = true;
      if (id.startsWith("distro-")) { navigate("linux"); openDistroModal(id.slice(7)); }
      else if (id.startsWith("win")) { navigate("windows"); activateWinTab(id); }
      else if (id.startsWith("home-")) navigate({ "home-windows": "windows", "home-linux": "linux", "home-hack": "hackintosh", "home-macos": "compare" }[id] || "home");
      else navigate("home");
      return;
    }
    // Close drawer on outside click
    if (!drawer.hidden && !e.target.closest("#favDrawer") && !e.target.closest("#favoritesBtn")) drawer.hidden = true;
  });

  $("#favoritesBtn").addEventListener("click", () => { drawer.hidden = !drawer.hidden; });
  $("#favClose").addEventListener("click", () => { drawer.hidden = true; });

  syncUI();
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initScrollUI();
  initTabs();
  renderDistros();
  initModal();
  renderCompare();
  quizRender();
  initSearch();
  initFavorites();
  observeReveals();
  navigate(location.hash.slice(1) || "home", { scroll: false });
});

'use client';

import { Github, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-background/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            AI Word Processor
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                            Empowering your documentation workflow with state-of-the-art AI generation.
                            Create professional proposals, reports, and letters in seconds.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    How it Works
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal/Social */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} AI Word Processor. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <SocialLink icon={<Github className="w-4 h-4" />} href="#" label="GitHub" />
                        <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" label="Twitter" />
                        <SocialLink icon={<Mail className="w-4 h-4" />} href="#" label="Email" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
            {icon}
        </a>
    );
}

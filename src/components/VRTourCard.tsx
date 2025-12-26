import React from 'react';
import { Link } from 'react-router-dom';

export default function VRTourCard() {
    return (
        <Link to="/vr-tour" className="block group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-6xl">🥽</div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                            NEW
                        </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3">
                        Immersive VR Tour
                    </h3>

                    <p className="text-white/90 text-base mb-6">
                        Experience Tamil Nadu's iconic destinations in stunning 360° virtual reality.
                        Visit Meenakshi Temple, Marina Beach, and Ooty from anywhere!
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <span>🏛️</span>
                            <span>5 Destinations</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <span>⚪</span>
                            <span>Interactive</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <span>📱</span>
                            <span>Mobile Ready</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition group-hover:scale-110 transform duration-300">
                            Start VR Experience →
                        </button>

                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all duration-500"></div>
            </div>
        </Link>
    );
}

import { useGameScreenStore } from '@/store/gameScreenStore'
import { useState, useEffect } from 'react'

import GameMenuScreen from '@/components/game/GameMenuScreen'
import GameMapScreen from '@/components/game/GameMapScreen'
import GameLocationScreen from '@/components/game/GameLocationScreen'
import GameCharacterScreen from '@/components/game/GameCharacterScreen'
import GameInventoryScreen from '@/components/game/GameInventoryScreen'
import GameStatusScreen from '@/components/game/GameStatusScreen'

import CinematicSignboard from '@/components/CinematicSignboard'

export default function GamePage() {

  const currentScreen = useGameScreenStore((state) => state.currentScreen)
    const setScreen = useGameScreenStore((state) => state.setScreen)

      const [showCinematic, setShowCinematic] = useState(true)
        const [ready, setReady] = useState(false)

          useEffect(() => {

              // garante tela inicial
                  setScreen('menu')

                      // pequena espera para garantir store pronta
                          setTimeout(() => {
                                setReady(true)
                                    }, 100)

                                      }, [])

                                        useEffect(() => {

                                            if (!ready) return

                                                const timer = setTimeout(() => {

                                                      setShowCinematic(false)

                                                          }, 5000)

                                                              return () => clearTimeout(timer)

                                                                }, [ready])

                                                                  const renderScreen = () => {

                                                                      switch (currentScreen) {

                                                                            case 'map':
                                                                                    return <GameMapScreen />

                                                                                          case 'location':
                                                                                                  return <GameLocationScreen />

                                                                                                        case 'character':
                                                                                                                return <GameCharacterScreen />

                                                                                                                      case 'inventory':
                                                                                                                              return <GameInventoryScreen />

                                                                                                                                    case 'status':
                                                                                                                                            return <GameStatusScreen />

                                                                                                                                                  case 'menu':
                                                                                                                                                        default:
                                                                                                                                                                return <GameMenuScreen />

                                                                                                                                                                    }

                                                                                                                                                                      }

                                                                                                                                                                        if (!ready) {
                                                                                                                                                                            return (
                                                                                                                                                                                  <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
                                                                                                                                                                                          Loading...
                                                                                                                                                                                                </div>
                                                                                                                                                                                                    )
                                                                                                                                                                                                      }

                                                                                                                                                                                                        return (

                                                                                                                                                                                                            <div className="w-screen h-screen bg-black overflow-hidden relative">

                                                                                                                                                                                                                  {showCinematic ? (
                                                                                                                                                                                                                          <CinematicSignboard />
                                                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                                        renderScreen()
                                                                                                                                                                                                                                              )}

                                                                                                                                                                                                                                                  </div>

                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                    }

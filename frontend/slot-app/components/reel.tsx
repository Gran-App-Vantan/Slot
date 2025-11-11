'use client';
import { useState, useRef, useEffect } from "react";

interface ReelProps {
    running: boolean; // 親から制御される実行状態
    symbolChange: (keys: [string, string, string]) => void; // 3行のシンボルキー（上、中央、下）
    reelIndex: number; // リールのインデックス（0, 1, 2）
}

function Reel({ running, symbolChange, reelIndex }: ReelProps) {
    // アイテムの間隔
    const ITEM_SPACING = 200;
    // wheel-lineの中心にアイテムを配置するための計算
    const CENTER_POSITION = 127;

    // 基本アイテム数
    const BASE_ITEMS_COUNT = 7;
    // 無限ループのために複数セット用意
    const TOTAL_ITEMS = BASE_ITEMS_COUNT * 3;

    // 各リールごとのシンボル順序
    const REEL_SEQUENCES: string[][] = [
        // 1stリール（左）
        ['aRole', 'dRole', 'bRole', 'fRole', 'cRole', 'gRole', 'eRole'],
        // 2ndリール（中央）
        ['bRole', 'eRole', 'aRole', 'gRole', 'dRole', 'cRole', 'fRole'],
        // 3rdリール（右）
        ['cRole', 'fRole', 'gRole', 'aRole', 'eRole', 'dRole', 'bRole']
    ];
    
    // シンボルキーから画像要素を取得する関数
    const getRoleByKey = (key: string) => {
        const role = {
            aRole: <img src="/slot-item/1762352725612.png" className="w-[140px] h-[130px] object-cover" alt="淳平No.1" />,
            bRole: <img src="/slot-item/IMG_4021.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.2" />,
            cRole: <img src="/slot-item/IMG_5546.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.3" />,
            dRole: <img src="/slot-item/IMG_5964.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.4" />,
            eRole: <img src="/slot-item/IMG_7581.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.5" />,
            fRole: <img src="/slot-item/IMG_7721.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.6" />,
            gRole: <img src="/slot-item/IMG_7773.jpg" className="w-[140px] h-[130px] object-cover" alt="淳平No.7" />,
        };
        return role[key as keyof typeof role];
    };

    // シンボルキーの配列を生成（リールごとに指定された順序で繰り返し）
    const [roleItemsKey] = useState(() => {
        const keys: string[] = [];
        // リールごとに指定された順序を使用
        const sequence = REEL_SEQUENCES[reelIndex];
        
        // TOTAL_ITEMS個のシンボルを生成（指定された順序で繰り返し）
        for (let i = 0; i < TOTAL_ITEMS; i++) {
            keys.push(sequence[i % sequence.length]);
        }
        return keys;
    });

    // アイテムを状態として保持（シンボルキーから生成して同期）
    const [Items] = useState(() => roleItemsKey.map(key => getRoleByKey(key)));

    const cycleLength = ITEM_SPACING * BASE_ITEMS_COUNT;
    // 中央のセット(インデックス7-13)から開始するための初期オフセット
    const INITIAL_OFFSET = ITEM_SPACING * BASE_ITEMS_COUNT;
    
    // アニメーションを停止の管理
    const animationRef = useRef<number>(0);
    // アニメーション開始時刻の管理
    const startTimeRef = useRef<number>(0);
    // 現在のスクロール位置（オフセット）の管理
    const offsetRef = useRef<number>(INITIAL_OFFSET);
    // アニメーション対象のDOM要素への参照
    const containerRef = useRef<HTMLDivElement>(null);

    const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        // 0.3秒で620px移動する速度を計算
        const speed = 620 / 300; // px per ms
        const rawOffset = (elapsed * speed);

        // 1サイクル分（7アイテム）でループ、初期オフセットを加える
        const currentOffset = (rawOffset % cycleLength) + INITIAL_OFFSET;
        offsetRef.current = currentOffset;

        if (containerRef.current) {
            containerRef.current.style.transform = `translateY(-${currentOffset}px)`;
        }

        if (running) {
            animationRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (running) {
            startTimeRef.current = 0;
            // アニメーションを開始
            animationRef.current = requestAnimationFrame(animate);
        } else {
            // アニメーションを停止し、次のアイテム（下側）にスナップ
            cancelAnimationFrame(animationRef.current);
            // 下側にスナップするための計算
            const currentOffset = offsetRef.current - INITIAL_OFFSET;
            const nearestItemIndex = Math.ceil(currentOffset / ITEM_SPACING);
            const snappedOffset = (nearestItemIndex * ITEM_SPACING) + INITIAL_OFFSET;

            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.5s ease-out';
                containerRef.current.style.transform = `translateY(-${snappedOffset}px)`;
                offsetRef.current = snappedOffset;
            }

            // 停止時に3行のシンボルキーを親に通知（トランジション完了後に実行）
            setTimeout(() => {
                // スナップ後のオフセットから中央に表示されているアイテムのインデックスを計算
                const finalOffset = offsetRef.current - INITIAL_OFFSET;
                const finalItemIndex = Math.round(finalOffset / ITEM_SPACING);
                const centerIndex = finalItemIndex + BASE_ITEMS_COUNT;
                
                // 3行のシンボルキーを取得（上、中央、下）
                const topIndex = centerIndex - 1;
                const bottomIndex = centerIndex + 1;
                
                if (topIndex >= 0 && centerIndex >= 0 && bottomIndex < TOTAL_ITEMS) {
                    const topKey = roleItemsKey[topIndex];
                    const centerKey = roleItemsKey[centerIndex];
                    const bottomKey = roleItemsKey[bottomIndex];
                    
                    console.log(`リール${reelIndex}停止: 上=${topKey}, 中央=${centerKey}, 下=${bottomKey}`); // デバッグ用
                    
                    if (topKey && centerKey && bottomKey) {
                        symbolChange([topKey, centerKey, bottomKey]);
                    }
                }
            }, 500); // トランジション時間（0.5s）後に実行
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [running, roleItemsKey, reelIndex]); // symbolChangeを依存配列から削除

    // 停止時にトランジションを設定
    useEffect(() => {
        if (!running && containerRef.current) {
            containerRef.current.style.transition = 'transform 0.5s ease-out';
        } else if (running && containerRef.current) {
            containerRef.current.style.transition = 'none';
        }
    }, [running]);

    return (
        <div className="wheel-line overflow-hidden relative">
            <div
                ref={containerRef}
                className="py-2"
                style={{
                    transform: `translateY(-${INITIAL_OFFSET}px)`,
                    transition: 'none'
                }}
            >
                {Items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="slot-item absolute left-4"
                            style={{top: `${CENTER_POSITION + index * ITEM_SPACING}px`}}
                        >
                            <div className="w-full h-full flex justify-center items-end">
                                {item}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Reel;
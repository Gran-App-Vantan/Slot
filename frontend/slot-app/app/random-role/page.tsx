'use client';
import StartStop from "../../components/StartStop";
import { useState, useRef, useEffect } from "react";
import GetRole from "../../components/role/get-role";

export default function Role() {
    // アイテムの間隔
    const ITEM_SPACING = 200;
    // wheel-lineの中心にアイテムを配置するための計算
    const CENTER_POSITION = 127;

    // 基本アイテム数
    const BASE_ITEMS_COUNT = 6;
    // 無限ループのために複数セット用意
    const TOTAL_ITEMS = BASE_ITEMS_COUNT * 3;
    const Items = Array(TOTAL_ITEMS).fill(null).map(() => GetRole());

    const cycleLength = ITEM_SPACING * BASE_ITEMS_COUNT;
    // 中央のセット(インデックス6-11)から開始するための初期オフセット
    const INITIAL_OFFSET = ITEM_SPACING * BASE_ITEMS_COUNT;
    const [running, setRunning] = useState(false);
    
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

        // 1サイクル分（6アイテム）でループ、初期オフセットを加える
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
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [running]);

    const handleToggle = () => {
        if (running && containerRef.current) {
            // 停止するときはトランジションを有効にする
            containerRef.current.style.transition = 'transform 0.3s ease-out';
        } else if (containerRef.current) {
            // 開始するときはトランジションを無効にする
            containerRef.current.style.transition = 'none';
        }
        setRunning(prev => !prev);
    };

    return (
        <>
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
                                {item}
                            </div>
                        )
                    })}
                </div>
            </div>
            <StartStop onStop={handleToggle} />
        </>
    );
}
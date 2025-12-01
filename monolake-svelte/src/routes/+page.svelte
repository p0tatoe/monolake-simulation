<script>
    import { Canvas } from '@threlte/core';
    import Scene from '$lib/components/Scene.svelte';
</script>

<div class="canvas-wrapper">
    <Canvas>
        <Scene />
    </Canvas>
</div>

<div class="overlay-ui">
    <h1>My 3D App</h1>
</div>

<style>
    .canvas-wrapper {
        width: 100vw;
        height: 100vh;
    }

</style>
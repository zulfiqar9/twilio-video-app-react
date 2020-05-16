import React, { useCallback, useEffect, useRef, useState } from 'react';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { IconButton } from '@material-ui/core';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function FlipCameraButton() {
  const { localTracks } = useVideoContext();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find(track => track.name.includes('camera'));
  const curFacingMode = videoTrack?.mediaStreamTrack.getSettings().facingMode || 'user';
  const facingModeRef = useRef<string>(curFacingMode);

  useEffect(() => {
    // The 'supportsFacingMode' variable determines if this component is rendered
    // If 'curFacingMode' exists, we will set supportsFacingMode to true.
    // However, if facingMode is ever undefined again (when the user unpublishes video), we
    // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
    // disappearing when the user switches their front/rear camera.
    if (curFacingMode && supportsFacingMode === null) {
      setSupportsFacingMode(Boolean(curFacingMode));
    }
  }, [curFacingMode, supportsFacingMode]);

  const toggleFacingMode = useCallback(() => {
    const facingMode = facingModeRef.current === 'user' ? 'environment' : 'user';
    (videoTrack as any)?.setInputOptions({ facingMode }).then(() => {
      facingModeRef.current = facingMode;
    });
  }, [videoTrack]);

  return supportsFacingMode ? (
    <IconButton onClick={toggleFacingMode} disabled={!videoTrack}>
      <FlipCameraIosIcon />
    </IconButton>
  ) : null;
}

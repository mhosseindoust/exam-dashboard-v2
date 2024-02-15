'use client'
import { Button } from 'antd'

const ToolsSection = () => {
  return (
    <div>
      <Button type='primary' block onClick={() => window.print()}>
        چاپ
      </Button>
    </div>
  )
}

export default ToolsSection

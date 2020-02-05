'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './loanCheck.less'

import Steps from 'Base/steps'

import Step1 from 'Base/allSteps/step1'
import Step2 from 'Base/allSteps/step2'
import Step3 from 'Base/allSteps/step3'
import Step4 from 'Base/allSteps/step4'


class LoanCheck extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { className = '', loggedIn, session } = this.props,
            admin = loggedIn.role == 'admin'

        return <div className={`${style.loanCheck} ${className}`}>
            <Steps
                key={session.id}
                list={[
                    { name: 'בדיקת BDI', title: 'בדיקת BDI', subTitle: 'הזן את פרטי הלקוח', Comp: Step1, props: {} },
                    { name: 'בדיקת אשראי', title: 'בדיקת אשראי J5', subTitle: 'הזן פרטי כרטיס אשראי של הלקוח', Comp: Step2, props: {} },
                    ...(admin ? [{ name: 'ממשק SAP', title: 'טופס מודל החיתום', subTitle: 'מלא את הטופס', Comp: Step3, props: {} }] : []),
                    { name: 'תוצאות', title: '', subTitle: '', Comp: Step4, props: {} },
                ]}
            />
        </div>
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), {})(LoanCheck)